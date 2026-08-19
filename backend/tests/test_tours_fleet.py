import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_tours_and_fleet_end_to_end_lifecycle():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # --- 1. TOURS VERTICAL LIFECYCLE ---
        # Create Destination
        dest_res = await ac.post("/api/tours/destinations", json={
            "name": "Manali", "state": "Himachal Pradesh", "country": "India", "description": "Snowy hills"
        })
        assert dest_res.status_code == 200
        dest_id = dest_res.json()["id"]

        # Create Package
        pkg_res = await ac.post("/api/tours/packages", json={
            "slug": "manali-snow-trek",
            "title": "Manali Snow Trek Expedition",
            "description": "5 days of alpine trekking",
            "duration_days": 5,
            "duration_nights": 4,
            "base_price": 15000.0,
            "deposit_price": 3000.0,
            "destination_id": dest_id,
            "images": ["http://example.com/manali.jpg"],
            "inclusions": ["Stay", "Meals", "Guide"],
            "itineraries": [
                {"day_number": 1, "title": "Arrival in Manali", "description": "Acclimatization day", "meals": "Dinner", "stay_details": "Hotel Snow View"}
            ]
        })
        assert pkg_res.status_code == 200
        pkg_id = pkg_res.json()["id"]

        # Capture Inquiry (Lead Funnel)
        inquiry_res = await ac.post("/api/tours/inquiries", json={
            "customer_name": "Rohan Sharma",
            "customer_email": "rohan@example.com",
            "customer_phone": "+91 9988776655",
            "package_id": pkg_id,
            "travel_date": "2026-10-15",
            "pax_count": 2,
            "notes": "Prefer window seats"
        })
        assert inquiry_res.status_code == 200
        assert inquiry_res.json()["status"] == "New"

        # Create Tours Booking (Deposit Paid)
        booking_res = await ac.post("/api/tours/bookings", json={
            "package_id": pkg_id,
            "customer_name": "Rohan Sharma",
            "customer_email": "rohan@example.com",
            "customer_phone": "+91 9988776655",
            "travel_date": "2026-10-15T00:00:00",
            "pax_count": 2
        })
        assert booking_res.status_code == 200
        booking_data = booking_res.json()
        assert booking_data["total_amount"] == 30000.0
        assert booking_data["deposit_paid"] == 6000.0
        assert booking_data["balance_amount"] == 24000.0
        assert booking_data["status"] == "Deposit Paid"


        # --- 2. FLEET VERTICAL LIFECYCLE ---
        # Create Vehicle Category
        cat_res = await ac.post("/api/fleet/categories", json={
            "name": "SUV 4x4", "description": "All-terrain vehicles"
        })
        assert cat_res.status_code == 200
        cat_id = cat_res.json()["id"]

        # Create Vehicle
        veh_res = await ac.post("/api/fleet/vehicles", json={
            "name": "Mahindra Thar 4x4",
            "reg_number": "HP-01-AB-1234",
            "category_id": cat_id,
            "vehicle_type": "car",
            "daily_rate": 3500.0,
            "security_deposit": 5000.0,
            "images": ["http://example.com/thar.jpg"],
            "specs": {"transmission": "Manual", "fuel": "Diesel"}
        })
        assert veh_res.status_code == 200
        veh_id = veh_res.json()["id"]

        # Create Fleet Booking (Deposit Paid)
        fl_booking_res = await ac.post("/api/fleet/bookings", json={
            "vehicle_id": veh_id,
            "customer_name": "Anita Verma",
            "customer_email": "anita@example.com",
            "customer_phone": "+91 9811223344",
            "license_number": "DL-1420110012345",
            "license_document_url": "http://example.com/license.jpg",
            "pickup_datetime": "2026-09-01T10:00:00",
            "dropoff_datetime": "2026-09-04T10:00:00"
        })
        assert fl_booking_res.status_code == 200
        fl_data = fl_booking_res.json()
        assert fl_data["total_rental_amount"] == 10500.0  # 3 days * 3500
        assert fl_data["security_deposit_amount"] == 5000.0
        assert fl_data["status"] == "Deposit Paid"
        fl_booking_id = fl_data["id"]

        # Handover / Pickup (Staff visual verification + rental fee payment)
        pickup_res = await ac.put(f"/api/fleet/bookings/{fl_booking_id}/pickup", json={
            "pickup_payment_method": "UPI",
            "license_visually_verified": True
        })
        assert pickup_res.status_code == 200
        assert pickup_res.json()["status"] == "Picked Up (Paid in Full)"
        assert pickup_res.json()["pickup_payment_method"] == "UPI"

        # Vehicle Return
        return_res = await ac.put(f"/api/fleet/bookings/{fl_booking_id}/return")
        assert return_res.status_code == 200
        assert return_res.json()["status"] == "Returned"

        # Admin Deposit Refund
        refund_res = await ac.put(f"/api/fleet/bookings/{fl_booking_id}/refund")
        assert refund_res.status_code == 200
        assert refund_res.json()["status"] == "Deposit Refunded"
        assert refund_res.json()["refund_ref"].startswith("RF-")


        # --- 3. AUDIT LOG VERIFICATION ---
        audit_res = await ac.get("/api/analytics/audit-logs")
        assert audit_res.status_code == 200
        logs = audit_res.json()
        assert len(logs) >= 3
