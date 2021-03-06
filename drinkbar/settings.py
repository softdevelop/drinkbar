"""
Django settings for drinkbar project.

Generated by 'django-admin startproject' using Django 1.11.2.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""

import os
import stripe
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '3xt@1z(omo)$2a#-33$-&g_(*oenruasc+u2555ny)lg03qppn'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

DEVELOPING_MODE = False

ALLOWED_HOSTS = ['*',]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework.authtoken',
    'categories',
    "categories.editor",
    'corsheaders',
    'mathfilters',
    'import_export',
    'django_cleanup',
    'channels',
    'channels_api',
    'twitter',
    'haystack',

    'Manager',
]

HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.BaseSignalProcessor'

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.elasticsearch_backend.ElasticsearchSearchEngine',
        'URL': 'http://127.0.0.1:9200/',
        'INDEX_NAME': 'elasticsearch',
        'INCLUDE_SPELLING': True,
    },
}

ASGI_APPLICATION = "drinkbar.routing.application"

# CHANNEL_LAYERS = {
#     "default": {
#         "BACKEND": "asgiref.inmemory.ChannelLayer",
#         "ROUTING": "drinkbar.routing.channel_routing",
#     },
# }

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "asgi_redis.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("localhost", 6379)],
        },
        "ROUTING": "drinkbar.routing.channel_routing",
    },
}

CHANNELS_API = {
  'DEFAULT_PAGE_SIZE': 25
}

MIDDLEWARE = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

CORS_ORIGIN_ALLOW_ALL = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        # 'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.QueryParameterVersioning',
    'PAGE_SIZE': 10,
    'PAGINATE_BY': 10,  # Default to 10
    'PAGINATE_BY_PARAM': 'page_size',  # Allow client to override, using `?page_size=xxx`.
    'MAX_PAGINATE_BY': 10,  # Maximum limit allowed when using `?page_size=xxx`.


    # Render data
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    )
}

ROOT_URLCONF = 'drinkbar.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR,'drinkbar/templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'drinkbar.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'drinkBar',                      # Or path to database file if using sqlite3.
        'USER': 'root',
        'PASSWORD': '123456789@X',
        'HOST': 'localhost',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '3306',                      # Set to empty string for default.
    }
}

AUTH_USER_MODEL = 'Manager.UserBase'

# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

# send mail
EMAIL_HOST = 'a2plcpnl0236.prod.iad2.secureserver.net'
EMAIL_HOST_USER = 'thankyou@hiefficiencybar.com'
EMAIL_HOST_PASSWORD = '123123123'
EMAIL_PORT = 25
EMAIL_USE_TLS = True
EMAIL_FROM='thankyou@hiefficiencybar.com'

# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_HOST_USER = 'user123example@gmail.com'
# EMAIL_HOST_PASSWORD = 'A123123Z'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_FROM='user123example@gmail.com'
#Payment setting.

STRIPE_KEYS = {
  'SECRET_KEY': 'sk_test_PHRmdPKDLOKagzUJciB8Bi8T',
  'PUBLISHABLE_KEY': 'pk_test_KSMESnZKrSyuNxek4u6JmQPb'
}
stripe.api_key = STRIPE_KEYS['SECRET_KEY']


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/
SITE_URL = "http://hiefficiencybar.com"
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'blur-admin/release'), 
                    os.path.join(BASE_DIR, 'drinkbar/templates/webpage'),
                    os.path.join(BASE_DIR, 'drinkbar/templates/email/static')]
                    
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = SITE_URL+"/static/" 
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = SITE_URL+"/media/"

#twitter
CONSUMER_KEY = 'zkp9NnO9VQdQXgpMYk8g6mRAl'
CONSUMER_SECRET = 'h7CBMYiGGQGkeJYrSvCcxwlOaiDi4KwXBWgt9C54QqboCBtHLE'
ACCESS_TOKEN = '839669582478524416-JnmOlZwoiYNxlOoxDWZ0KAGpHy929f6'
ACCESS_TOKEN_SECRET = '4lWN4BbD120Zz7foBaSUfglkXBs0XME08cRPLzJSUKIQG'
TWITTER_EMAIL = 'HiEfficiencyBar@gmail.com'
TWITTER_PASSWORD = 'RyanHoover1!!'


USE_TZ = False

try:
    from .settings_local import *
except ImportError as e:
    print(e)