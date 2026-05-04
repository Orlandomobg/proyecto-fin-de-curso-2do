import httpx
from app.utils.settings import settings

async def get_panels_data():
    node_production_url = f"{settings.NODE_URL}/production/panels"
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(node_production_url)
        
        if response.status_code != 200:
            print(f"error: {response.text}")
        response.raise_for_status()
        return response.json()
    
    except Exception as e: 
        raise Exception (f"Unexpected error: {str(e)}")
    
async def get_panel_data_id(id: str):
    node_production_url = f"{settings.NODE_URL}/production/panel/{id}"
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(node_production_url)
        
        if response.status_code != 200:
            print(f"error: {response.text}")
        response.raise_for_status()
        return response.json()
    
    except Exception as e: 
        raise Exception (f"Unexpected error: {str(e)}")
    
async def get_panel_property_id(id: str):
    node_production_url = f"{settings.NODE_URL}/production/properties/{id}"
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(node_production_url)
        
        if response.status_code != 200:
            print(f"error: {response.text}")
        response.raise_for_status()
        return response.json()
    
    except Exception as e: 
        raise Exception (f"Unexpected error: {str(e)}") 