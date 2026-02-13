from fastapi import FastAPI

app = FastAPI(title="SkySportsSample API", version="0.1.0")

@app.get("/v1/health")
def health():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"message": "SkySportsSample API is running. See /docs"}
