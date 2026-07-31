# Uncomment the imports before you add the code
# from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
# from . import views
from . import views
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings


app_name = 'djangoapp'
urlpatterns = [
    # # path for registration

    # path for login
    # path(route='login', view=views.login_user, name='login'),
    path(route='login', view=views.login_user, name='login'),    
    path(route='logout', view=views.logout, name='logout'),
    path(route='register', view=views.registration, name='register'),

    # path for dealer reviews view

    # path for add a review view
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)