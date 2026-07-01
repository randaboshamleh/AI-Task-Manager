import json
import os
import threading
import uuid
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "4000"))
MAX_BODY_BYTES = 1_000_000
DB_FILE = Path(__file__).with_name("tasks.db.json")
USERS_FILE = Path(__file__).with_name("users.db.json")

LOCK = threading.Lock()
USERS_LOCK = threading.Lock()


def create_id() -> str:
    return str(uuid.uuid4())


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def ensure_db_file() -> None:
    if not DB_FILE.exists():
        DB_FILE.write_text("[]", encoding="utf-8")


def ensure_users_file() -> None:
    if not USERS_FILE.exists():
        USERS_FILE.write_text("[]", encoding="utf-8")


def read_users() -> list[dict]:
    ensure_users_file()
    with USERS_LOCK:
        try:
            raw = USERS_FILE.read_text(encoding="utf-8")
            parsed = json.loads(raw)
            return parsed if isinstance(parsed, list) else []
        except Exception:
            return []


def write_users(users: list[dict]) -> None:
    with USERS_LOCK:
        USERS_FILE.write_text(json.dumps(users, ensure_ascii=True, indent=2), encoding="utf-8")


def read_tasks() -> list[dict]:
    ensure_db_file()
    with LOCK:
        try:
            raw = DB_FILE.read_text(encoding="utf-8")
            parsed = json.loads(raw)
            return parsed if isinstance(parsed, list) else []
        except Exception:
            return []


def write_tasks(tasks: list[dict]) -> None:
    with LOCK:
        DB_FILE.write_text(json.dumps(tasks, ensure_ascii=True, indent=2), encoding="utf-8")


def normalize_task(data: dict, existing: dict | None = None, forced_order: int | None = None) -> dict:
    base = existing or {}

    priority = data.get("priority")
    if priority not in {"high", "medium", "low"}:
        priority = base.get("priority", "medium")

    status = data.get("status")
    if status not in {"pending", "completed"}:
        status = base.get("status", "pending")

    order_value = forced_order if forced_order is not None else data.get("order", base.get("order", 0))
    if not isinstance(order_value, int):
        order_value = base.get("order", 0) if isinstance(base.get("order"), int) else 0

    name = str(data.get("name", base.get("name", "Untitled task"))).strip() or "Untitled task"

    return {
        "id": base.get("id") or create_id(),
        "name": name,
        "priority": priority,
        "status": status,
        "dueDate": data.get("dueDate", base.get("dueDate", None)),
        "createdAt": base.get("createdAt") or utc_now_iso(),
        "order": order_value,
    }


class TaskApiHandler(BaseHTTPRequestHandler):
    server_version = "TaskApiPython/1.0"

    def _set_headers(self, status: int, content_type: str = "application/json; charset=utf-8") -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def _json(self, status: int, body: dict | list) -> None:
        self._set_headers(status)
        payload = json.dumps(body, ensure_ascii=True).encode("utf-8")
        self.wfile.write(payload)

    def _error(self, status: int, message: str) -> None:
        self._json(status, {"error": message})

    def _read_json_body(self) -> dict:
        content_length = self.headers.get("Content-Length", "0")
        try:
            length = int(content_length)
        except ValueError as exc:
            raise ValueError("Invalid Content-Length") from exc

        if length < 0 or length > MAX_BODY_BYTES:
            raise ValueError("Payload too large")

        if length == 0:
            return {}

        raw = self.rfile.read(length)
        try:
            parsed = json.loads(raw.decode("utf-8"))
        except Exception as exc:
            raise ValueError("Invalid JSON") from exc

        if not isinstance(parsed, dict):
            raise ValueError("JSON body must be an object")

        return parsed

    def do_OPTIONS(self) -> None:
        self._set_headers(204)

    def do_GET(self) -> None:
        path = urlparse(self.path).path

        if path == "/api/health":
            self._json(200, {"ok": True, "date": utc_now_iso()})
            return

        if path == "/api/tasks":
            tasks = sorted(read_tasks(), key=lambda item: item.get("order", 0))
            self._json(200, tasks)
            return

        if path == "/api/users":
            users = read_users()
            self._json(200, users)
            return

        self._error(404, "Not found")

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        
        if path == "/api/register":
            try:
                body = self._read_json_body()
            except ValueError as exc:
                self._error(400, str(exc))
                return

            username = str(body.get("username", "")).strip()
            password = str(body.get("password", "")).strip()

            if not username or not password:
                self._error(400, "Username and password are required")
                return

            users = read_users()
            if any(u.get("username") == username for u in users):
                self._error(400, "Username already exists")
                return

            user = {
                "id": create_id(),
                "username": username,
                "password": password,
                "createdAt": utc_now_iso()
            }
            users.append(user)
            write_users(users)
            self._json(201, {"id": user["id"], "username": user["username"]})
            return

        if path == "/api/login":
            try:
                body = self._read_json_body()
            except ValueError as exc:
                self._error(400, str(exc))
                return

            username = str(body.get("username", "")).strip()
            password = str(body.get("password", "")).strip()

            if not username or not password:
                self._error(400, "Username and password are required")
                return

            users = read_users()
            user = next((u for u in users if u.get("username") == username and u.get("password") == password), None)

            if not user:
                self._error(401, "Invalid credentials")
                return

            self._json(200, {"id": user["id"], "username": user["username"]})
            return
        
        if path != "/api/tasks":
            self._error(404, "Not found")
            return

        try:
            body = self._read_json_body()
        except ValueError as exc:
            self._error(400, str(exc))
            return

        if not str(body.get("name", "")).strip():
            self._error(400, "Task name is required")
            return

        tasks = read_tasks()
        next_order = max((task.get("order", 0) for task in tasks), default=-1) + 1
        task = normalize_task(body, forced_order=next_order)
        tasks.append(task)
        write_tasks(tasks)
        self._json(201, task)

    def do_PUT(self) -> None:
        path = urlparse(self.path).path
        if not path.startswith("/api/tasks/"):
            self._error(404, "Not found")
            return

        task_id = unquote(path.split("/api/tasks/", 1)[1]).strip()
        if not task_id:
            self._error(404, "Not found")
            return

        try:
            body = self._read_json_body()
        except ValueError as exc:
            self._error(400, str(exc))
            return

        tasks = read_tasks()
        index = next((i for i, task in enumerate(tasks) if task.get("id") == task_id), -1)
        if index == -1:
            self._error(404, "Task not found")
            return

        updated = normalize_task(body, existing=tasks[index])
        tasks[index] = updated
        write_tasks(tasks)
        self._json(200, updated)

    def do_DELETE(self) -> None:
        path = urlparse(self.path).path
        if not path.startswith("/api/tasks/"):
            self._error(404, "Not found")
            return

        task_id = unquote(path.split("/api/tasks/", 1)[1]).strip()
        if not task_id:
            self._error(404, "Not found")
            return

        tasks = read_tasks()
        filtered = [task for task in tasks if task.get("id") != task_id]

        if len(filtered) == len(tasks):
            self._error(404, "Task not found")
            return

        reordered = [{**task, "order": idx} for idx, task in enumerate(filtered)]
        write_tasks(reordered)
        self._json(200, {"ok": True})

    def log_message(self, format: str, *args) -> None:
        return


def run() -> None:
    ensure_db_file()
    ensure_users_file()
    server = ThreadingHTTPServer((HOST, PORT), TaskApiHandler)
    print(f"Task API is running on http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    run()
