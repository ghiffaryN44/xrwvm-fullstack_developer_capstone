# Uncomment the imports before you add the code
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'
urlpatterns = [
    # Auth routing paths
    path(route='login', view=views.login_user, name='login'),    
    path(route='logout', view=views.logout_request, name='logout'), # FIXED: Linked to views.logout_request
    path(route='register', view=views.registration, name='register'),
    path(route='get_cars', view=views.get_cars, name='getcars'),
    
    # Dealer and Reviews microservice routing endpoints
    path(route='get_dealers/', view=views.get_dealerships, name='get_dealers'),
    path(route='get_dealers/<str:state>', view=views.get_dealerships, name='get_dealers_by_state'),
    path(route='dealer/<int:dealer_id>', view=views.get_dealer_details, name='dealer_details'),
    
    # FIXED: Updated the name token identifier to eliminate the duplicate naming collision
    path(route='reviews/dealer/<int:dealer_id>', view=views.get_dealer_reviews, name='dealer_reviews'),
    
    path(route='add_review', view=views.add_review, name='add_review'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
