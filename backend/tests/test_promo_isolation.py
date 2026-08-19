import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_promo_code_vertical_isolation():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Create a promo code valid ONLY for Tours
        tours_promo_data = {
            "code": "TOURS10",
            "discount_percentage": 10,
            "max_discount_amount": 1000,
            "valid_vertical": "tours"
        }
        res_create = await ac.post("/api/finance/promo-codes", json=tours_promo_data)
        assert res_create.status_code == 200
        
        # Test 1: Validate TOURS10 against 'tours' -> SHOULD SUCCEED
        res_valid = await ac.post("/api/finance/promo-codes/validate?code=TOURS10&vertical=tours")
        assert res_valid.status_code == 200
        assert res_valid.json()["valid"] is True
        
        # Test 2: Validate TOURS10 against 'fleet' -> MUST BE PROVABLY REJECTED (400)
        res_invalid = await ac.post("/api/finance/promo-codes/validate?code=TOURS10&vertical=fleet")
        assert res_invalid.status_code == 400
        assert "valid for TOURS only" in res_invalid.json()["detail"]
