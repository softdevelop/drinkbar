
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'drinkBar',                      # Or path to database file if using sqlite3.
        'USER': 'root',
        'PASSWORD': 'root',
        # 'PASSWORD': '2206',
        'HOST': 'localhost',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '3306',                      # Set to empty string for default.
    }
}

# send mail
EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 465
EMAIL_HOST_USER = 'user123example@gmail.com'
EMAIL_HOST_PASSWORD = 'A123123Z'
# EMAIL_USE_TLS = False 
# EMAIL_USE_SSL = True 
DEFAULT_FROM_EMAIL = 'user123example@gmail.com'
# DEFAULT_DOMAIN = 'http://localhost:2000'

EMAIL_PORT = 587
EMAIL_USE_TLS = True


SITE_URL = "http://localhost:8000/"
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'blur-admin/release/'),]
STATIC_URL = SITE_URL+"static/" 
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = SITE_URL+"media/"