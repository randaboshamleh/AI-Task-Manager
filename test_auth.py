#!/usr/bin/env python3
"""
اختبار بسيط لنظام المصادقة
"""
import requests
import json

BASE_URL = "http://localhost:4000"

def test_register():
    """اختبار تسجيل مستخدم جديد"""
    print("🧪 اختبار التسجيل...")
    data = {
        "username": "test_user",
        "password": "test123"
    }
    response = requests.post(f"{BASE_URL}/api/register", json=data)
    print(f"   الحالة: {response.status_code}")
    if response.status_code == 201:
        print(f"   ✅ نجح التسجيل: {response.json()}")
        return True
    else:
        print(f"   ❌ فشل التسجيل: {response.text}")
        return False

def test_login():
    """اختبار تسجيل الدخول"""
    print("\n🧪 اختبار تسجيل الدخول...")
    data = {
        "username": "test_user",
        "password": "test123"
    }
    response = requests.post(f"{BASE_URL}/api/login", json=data)
    print(f"   الحالة: {response.status_code}")
    if response.status_code == 200:
        print(f"   ✅ نجح تسجيل الدخول: {response.json()}")
        return True
    else:
        print(f"   ❌ فشل تسجيل الدخول: {response.text}")
        return False

def test_login_wrong_password():
    """اختبار تسجيل الدخول بكلمة مرور خاطئة"""
    print("\n🧪 اختبار تسجيل الدخول بكلمة مرور خاطئة...")
    data = {
        "username": "test_user",
        "password": "wrong_password"
    }
    response = requests.post(f"{BASE_URL}/api/login", json=data)
    print(f"   الحالة: {response.status_code}")
    if response.status_code == 401:
        print(f"   ✅ تم رفض الدخول بشكل صحيح")
        return True
    else:
        print(f"   ❌ خطأ في التحقق")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("اختبار نظام المصادقة")
    print("=" * 50)
    print("\nتأكد من تشغيل الخادم أولاً: python backend/server.py\n")
    
    try:
        # اختبار الاتصال
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            print("✅ الخادم يعمل بشكل صحيح\n")
        else:
            print("❌ الخادم لا يستجيب")
            exit(1)
        
        # تشغيل الاختبارات
        test_register()
        test_login()
        test_login_wrong_password()
        
        print("\n" + "=" * 50)
        print("✅ انتهت جميع الاختبارات")
        print("=" * 50)
        
    except requests.exceptions.ConnectionError:
        print("❌ لا يمكن الاتصال بالخادم")
        print("تأكد من تشغيل: python backend/server.py")
    except Exception as e:
        print(f"❌ خطأ: {e}")
