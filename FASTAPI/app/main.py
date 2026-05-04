from fastapi import FastAPI
from app.routers import solar_resources,system_design,production,financial


app = FastAPI(
            title = "Solar Calculation Engine.",
            description="motor de calculo para instalaciones de paneles solares",
            version = "1.0.0"
)

app.include_router(solar_resources.router,
                    prefix= "/solar_resource",
                    tags = ["solar resources"])

app.include_router(system_design.router,
                    prefix = "/system_design",
                    tags = ["system design"])

app.include_router(production.router,
                    prefix="/production",
                    tags=["Production"])

app.include_router(financial.router,
                   prefix="/financial",
                   tags=["Financial"])

@app.get("/health")
def health():
    return {"status": "ok"}