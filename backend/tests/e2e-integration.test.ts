/**
 * Complete End-to-End (E2E) Integration Test Suite
 * Tests Website Customer Flows, Express Backend APIs, and CRM Management Features.
 */

const API_BASE = 'http://localhost:8000/api';
const WEBSITE_URL = 'http://localhost:3000';
const CRM_URL = 'http://localhost:5173';

interface TestResult {
  suite: string;
  test: string;
  passed: boolean;
  details?: any;
  error?: string;
}

const results: TestResult[] = [];

function recordTest(suite: string, test: string, passed: boolean, details?: any, error?: string) {
  results.push({ suite, test, passed, details, error });
  const symbol = passed ? '✅' : '❌';
  console.log(`  ${symbol} [${suite}] ${test}`);
  if (!passed && error) {
    console.error(`     Error details: ${error}`);
  }
}

async function request(path: string, options: RequestInit = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    const res = await fetch(url, {
      ...options,
      headers,
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, ok: res.ok, data };
  } catch (err: any) {
    return { status: 0, ok: false, data: null, error: err.message };
  }
}

// Extract payload arrays or objects whether wrapped in sendSuccess or raw
function extractData<T = any>(resData: any): T {
  if (resData && typeof resData === 'object' && 'data' in resData && resData.success !== undefined) {
    return resData.data;
  }
  return resData;
}

async function runAllTests() {
  console.log('\n===============================================================');
  console.log('🚀 STARTING AARAMBHA TRAVELS PLATFORM E2E INTEGRATION SUITE');
  console.log('===============================================================\n');

  let superAdminToken = '';
  let viewerToken = '';
  let createdTourBookingId = '';
  let createdTourBookingCode = '';
  let createdFleetBookingId = '';
  let createdFleetBookingCode = '';
  let createdInquiryId = '';
  let createdPromoCode = '';

  // ─────────────────────────────────────────────────────────────────────────────
  // SUITE 1: Service Health & Infrastructure
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n📌 Suite 1: Service Health & Infrastructure');
  try {
    const health = await request('/health');
    const healthData = extractData(health.data);
    recordTest(
      'Suite 1: Infrastructure',
      'Backend API Health Check (/api/health)',
      health.ok && healthData?.status === 'online',
      healthData
    );

    const webRes = await fetch(WEBSITE_URL).catch((err) => ({ ok: false, status: 0, statusText: err.message }));
    recordTest(
      'Suite 1: Infrastructure',
      'Website Frontend Responsive Server (port 3000)',
      webRes.ok,
      { status: webRes.status }
    );

    const crmRes = await fetch(CRM_URL).catch((err) => ({ ok: false, status: 0, statusText: err.message }));
    recordTest(
      'Suite 1: Infrastructure',
      'CRM Control Portal Server (port 5173)',
      crmRes.ok,
      { status: crmRes.status }
    );
  } catch (err: any) {
    recordTest('Suite 1: Infrastructure', 'Service Health Execution', false, null, err.message);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SUITE 2: Authentication & Role-Based Access Control
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n📌 Suite 2: Administrator & Viewer Authentication');
  try {
    // 2.1 Super Admin Login
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@aarambhatravels.in',
        password: 'Admin@123',
      }),
    });
    const adminData = extractData(adminLogin.data);
    const token = adminData?.access_token || adminData?.token;
    const adminSuccess = adminLogin.ok && Boolean(token) && adminData?.user?.role === 'superadmin';
    if (adminSuccess) {
      superAdminToken = token;
    }
    recordTest(
      'Suite 2: Auth',
      'SuperAdmin Login (admin@aarambhatravels.in)',
      adminSuccess,
      { role: adminData?.user?.role, name: adminData?.user?.name },
      adminLogin.ok ? undefined : JSON.stringify(adminLogin.data)
    );

    // 2.2 Viewer Login
    const viewerLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'viewer1@aarambhatravels.in',
        password: 'Viewer@123',
      }),
    });
    const vData = extractData(viewerLogin.data);
    const vToken = vData?.access_token || vData?.token;
    const viewerSuccess = viewerLogin.ok && Boolean(vToken) && vData?.user?.role === 'viewer';
    if (viewerSuccess) {
      viewerToken = vToken;
    }
    recordTest(
      'Suite 2: Auth',
      'Viewer Login (viewer1@aarambhatravels.in)',
      viewerSuccess,
      { role: vData?.user?.role }
    );

    // 2.3 Invalid Password Rejection
    const badLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@aarambhatravels.in',
        password: 'WrongPassword999',
      }),
    });
    recordTest(
      'Suite 2: Auth',
      'Reject Invalid Password (401 Unauthorized)',
      badLogin.status === 401
    );

    // 2.4 Protected Route Rejects Unauthenticated Request
    const noAuthReq = await request('/settings', { method: 'GET' });
    recordTest(
      'Suite 2: Auth',
      'Reject Unauthenticated Request to Protected Route (401)',
      noAuthReq.status === 401
    );
  } catch (err: any) {
    recordTest('Suite 2: Auth', 'Auth Suite Execution', false, null, err.message);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SUITE 3: Catalog & Rates API (Website & CRM Consumption)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n📌 Suite 3: Catalog & Rates API');
  try {
    const packagesRes = await request('/tours/packages');
    const packages = extractData<any[]>(packagesRes.data);
    recordTest(
      'Suite 3: Catalog',
      'Public Tour Packages Listing (/api/tours/packages)',
      packagesRes.ok && Array.isArray(packages) && packages.length > 0,
      { count: Array.isArray(packages) ? packages.length : 0 }
    );

    const vehiclesRes = await request('/fleet/vehicles');
    const vehicles = extractData<any[]>(vehiclesRes.data);
    recordTest(
      'Suite 3: Catalog',
      'Public Fleet Vehicles Inventory (/api/fleet/vehicles)',
      vehiclesRes.ok && Array.isArray(vehicles) && vehicles.length > 0,
      { count: Array.isArray(vehicles) ? vehicles.length : 0 }
    );

    const busesRes = await request('/fleet/buses');
    const buses = extractData<any[]>(busesRes.data);
    recordTest(
      'Suite 3: Catalog',
      'Public Bus Rates & Categories (/api/fleet/buses)',
      busesRes.ok && Array.isArray(buses),
      { count: Array.isArray(buses) ? buses.length : 0 }
    );

    const settingsRes = await request('/settings/public');
    const settings = extractData<any>(settingsRes.data);
    recordTest(
      'Suite 3: Catalog',
      'Public System Settings & UPI VPA (/api/settings/public)',
      settingsRes.ok && Boolean(settings?.upi_id || settings?.upiId || settings?.company_phone),
      { upi_id: settings?.upi_id || settings?.upiId, company: settings?.company_name }
    );
  } catch (err: any) {
    recordTest('Suite 3: Catalog', 'Catalog Suite Execution', false, null, err.message);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SUITE 4: Customer Booking Journey & Real-time CRM Reflection
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n📌 Suite 4: Customer Booking Journey & CRM Reflection');
  try {
    // 4.1 Tour Booking from Website
    const testTourCode = `AAR-TRIP-E2E-${Date.now().toString().slice(-6)}`;
    const tourBookingPayload = {
      id: testTourCode,
      bookingCode: testTourCode,
      customerName: 'Ananya Sharma',
      customerEmail: 'ananya.test@aarambha-e2e.com',
      customerPhone: '+919876543210',
      travelDate: '2026-10-15',
      paxCount: 2,
      depositAmount: 1999,
      totalAmount: 12998,
      utrNumber: `UTR${Date.now().toString().slice(-8)}`,
      notes: 'E2E Automated Integration Test - Vegetarian Meals',
      termsAccepted: true,
      agreementAccepted: true,
    };

    const createTourRes = await request('/tours/bookings', {
      method: 'POST',
      body: JSON.stringify(tourBookingPayload),
    });

    const tourData = extractData<any>(createTourRes.data);
    const tourCreated = createTourRes.ok && (createTourRes.status === 200 || createTourRes.status === 201);
    createdTourBookingId = tourData?._id || tourData?.id || '';
    createdTourBookingCode = tourData?.bookingCode || tourData?.booking_code || testTourCode;

    recordTest(
      'Suite 4: Bookings',
      'Customer submits Tour Booking from Website (/api/tours/bookings)',
      tourCreated,
      { code: createdTourBookingCode, status: tourData?.status || 'Pending Verification' },
      createTourRes.ok ? undefined : JSON.stringify(createTourRes.data)
    );

    // 4.2 Customer Sync Status (Provisional Receipt Polling)
    const syncStatusRes = await request('/tours/bookings/sync-status', {
      method: 'POST',
      body: JSON.stringify({ codes: [createdTourBookingCode] }),
    });
    const syncList = extractData<any[]>(syncStatusRes.data);
    const syncPassed = syncStatusRes.ok && Array.isArray(syncList) && syncList.length > 0;
    recordTest(
      'Suite 4: Bookings',
      'Customer polls Provisional Receipt Status (/sync-status)',
      syncPassed,
      { liveStatus: syncPassed ? syncList[0]?.status : 'unknown' }
    );

    // 4.3 CRM Admin Ingestion: Verify Tour Booking is reflected in CRM list
    const crmToursRes = await request('/tours/bookings', {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    const crmToursList = extractData<any[]>(crmToursRes.data);
    const foundInCrm = Array.isArray(crmToursList) && crmToursList.some(
      (b: any) => b.bookingCode === createdTourBookingCode || b.booking_code === createdTourBookingCode || b._id === createdTourBookingId || b.id === createdTourBookingId
    );
    recordTest(
      'Suite 4: Bookings',
      'CRM Live Ingestion: Booking dynamically appears in Admin Bookings list',
      foundInCrm,
      { bookingCode: createdTourBookingCode, totalBookings: crmToursList?.length || 0 }
    );

    // 4.4 Admin verifies payment in CRM (Pending -> Confirmed)
    if (createdTourBookingId) {
      const verifyRes = await request(`/tours/bookings/${createdTourBookingId}/verify`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${superAdminToken}` },
        body: JSON.stringify({ status: 'Confirmed' }),
      });
      const verifyData = extractData<any>(verifyRes.data);
      recordTest(
        'Suite 4: Bookings',
        'Admin Action: Verify Tour Payment in CRM (Status -> Confirmed)',
        verifyRes.ok && (verifyData?.status === 'Confirmed' || verifyData?.status === 'Verified'),
        { newStatus: verifyData?.status },
        verifyRes.ok ? undefined : JSON.stringify(verifyRes.data)
      );
    }

    // 4.5 Self-Drive Fleet Booking from Website
    const testFleetCode = `AAR-CAR-E2E-${Date.now().toString().slice(-6)}`;
    const fleetBookingPayload = {
      id: testFleetCode,
      bookingCode: testFleetCode,
      customerName: 'Rahul Mehta',
      customerEmail: 'rahul.test@aarambha-e2e.com',
      customerPhone: '+919123456780',
      pickupDatetime: '2026-10-20T09:00:00.000Z',
      dropoffDatetime: '2026-10-23T18:00:00.000Z',
      depositAmount: 500,
      totalRentalAmount: 7500,
      utrNumber: `UTRCAR${Date.now().toString().slice(-6)}`,
      licenseNumber: 'MH12-20220019283',
      termsAccepted: true,
      agreementAccepted: true,
    };

    const createFleetRes = await request('/fleet/bookings', {
      method: 'POST',
      body: JSON.stringify(fleetBookingPayload),
    });
    const fleetData = extractData<any>(createFleetRes.data);
    const fleetCreated = createFleetRes.ok && (createFleetRes.status === 200 || createFleetRes.status === 201);
    createdFleetBookingId = fleetData?._id || fleetData?.id || '';
    createdFleetBookingCode = fleetData?.bookingCode || fleetData?.booking_code || testFleetCode;

    recordTest(
      'Suite 4: Bookings',
      'Customer submits Self-Drive Car Rental Booking from Website',
      fleetCreated,
      { code: createdFleetBookingCode, id: createdFleetBookingId },
      createFleetRes.ok ? undefined : JSON.stringify(createFleetRes.data)
    );

    // 4.6 Fleet Lifecycle State Machine (Verify -> Pickup -> Return)
    if (createdFleetBookingId) {
      // Step A: Verify
      const verifyFleetRes = await request(`/fleet/bookings/${createdFleetBookingId}/verify`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${superAdminToken}` },
        body: JSON.stringify({ status: 'Confirmed' }),
      });
      const vFleetData = extractData<any>(verifyFleetRes.data);
      recordTest(
        'Suite 4: Bookings',
        'Fleet State Transition 1: Verify Payment in CRM',
        verifyFleetRes.ok,
        { status: vFleetData?.status }
      );

      // Step B: Mark Picked Up
      const pickupFleetRes = await request(`/fleet/bookings/${createdFleetBookingId}/pickup`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${superAdminToken}` },
        body: JSON.stringify({ pickupPaymentMethod: 'UPI' }),
      });
      const pFleetData = extractData<any>(pickupFleetRes.data);
      recordTest(
        'Suite 4: Bookings',
        'Fleet State Transition 2: Mark Vehicle Picked Up (Paid in Full)',
        pickupFleetRes.ok,
        { status: pFleetData?.status }
      );

      // Step C: Mark Returned
      const returnFleetRes = await request(`/fleet/bookings/${createdFleetBookingId}/return`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${superAdminToken}` },
      });
      const rFleetData = extractData<any>(returnFleetRes.data);
      recordTest(
        'Suite 4: Bookings',
        'Fleet State Transition 3: Mark Vehicle Returned & Complete',
        returnFleetRes.ok,
        { status: rFleetData?.status }
      );
    }
  } catch (err: any) {
    recordTest('Suite 4: Bookings', 'Booking Suite Execution', false, null, err.message);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SUITE 5: Customer Inquiries & Lead Funnel Pipeline
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n📌 Suite 5: Inquiries & Lead Funnel Pipeline');
  try {
    // 5.1 Website Tour Inquiry
    const inqRes = await request('/tours/inquiries', {
      method: 'POST',
      body: JSON.stringify({
        customerName: 'Priya Kulkarni',
        customerEmail: 'priya.test@aarambha-e2e.com',
        customerPhone: '+919988776655',
        notes: 'Interested in Ashtavinayak Yatra for family of 6',
      }),
    });
    const inqData = extractData<any>(inqRes.data);
    const inqCreated = inqRes.ok;
    createdInquiryId = inqData?._id || inqData?.id || '';
    recordTest(
      'Suite 5: Inquiries',
      'Website Lead Inquiry Submission (/api/tours/inquiries)',
      inqCreated,
      { id: createdInquiryId },
      inqRes.ok ? undefined : JSON.stringify(inqRes.data)
    );

    // 5.2 CRM Inquiry Ingestion
    const crmInqListRes = await request('/tours/inquiries', {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    const crmInqList = extractData<any[]>(crmInqListRes.data);
    const foundInq = Array.isArray(crmInqList) && crmInqList.some(
      (i: any) => i._id === createdInquiryId || i.id === createdInquiryId || i.customerEmail === 'priya.test@aarambha-e2e.com'
    );
    recordTest(
      'Suite 5: Inquiries',
      'CRM Lead Funnel Ingestion: Inquiry appears in CRM Inquiries view',
      foundInq,
      { totalInquiries: crmInqList?.length || 0 }
    );

    // 5.3 Inquiry Status Transition
    if (createdInquiryId) {
      const updateInqRes = await request(`/tours/inquiries/${createdInquiryId}/status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${superAdminToken}` },
        body: JSON.stringify({ status: 'Contacted' }),
      });
      recordTest(
        'Suite 5: Inquiries',
        'Update Inquiry Status in CRM (New -> Contacted)',
        updateInqRes.ok,
        extractData(updateInqRes.data)
      );
    }
  } catch (err: any) {
    recordTest('Suite 5: Inquiries', 'Inquiries Suite Execution', false, null, err.message);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SUITE 6: Financial Operations & Promo Codes
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n📌 Suite 6: Financial Operations & Promo Codes');
  try {
    createdPromoCode = `E2E${Date.now().toString().slice(-4)}`;
    const createPromoRes = await request('/finance/promo-codes', {
      method: 'POST',
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: JSON.stringify({
        code: createdPromoCode,
        discount_percentage: 15,
        discountPercentage: 15,
        max_discount_amount: 2000,
        maxDiscountAmount: 2000,
        valid_vertical: 'all',
        validVertical: 'all',
        isActive: true,
      }),
    });
    recordTest(
      'Suite 6: Finance',
      'CRM Promo Code Creation (/api/finance/promo-codes)',
      createPromoRes.ok,
      { promo: createdPromoCode },
      createPromoRes.ok ? undefined : JSON.stringify(createPromoRes.data)
    );

    // 6.2 Promo Code Validation (Website Checkout)
    const valPromoRes = await request('/finance/promo-codes/validate', {
      method: 'POST',
      body: JSON.stringify({
        code: createdPromoCode,
        vertical: 'tours',
      }),
    });
    const valData = extractData<any>(valPromoRes.data);
    recordTest(
      'Suite 6: Finance',
      'Website Promo Validation Engine (/promo-codes/validate)',
      valPromoRes.ok && (valData?.valid === true || valData?.discount_percentage === 15),
      valData,
      valPromoRes.ok ? undefined : JSON.stringify(valPromoRes.data)
    );

    // 6.3 List in CRM
    const listPromosRes = await request('/finance/promo-codes', {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    const promoList = extractData<any[]>(listPromosRes.data);
    const foundPromo = Array.isArray(promoList) && promoList.some((p: any) => p.code === createdPromoCode);
    recordTest(
      'Suite 6: Finance',
      'CRM Finance Dashboard: Promo listed in active table',
      foundPromo,
      { count: promoList?.length || 0 }
    );
  } catch (err: any) {
    recordTest('Suite 6: Finance', 'Finance Suite Execution', false, null, err.message);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SUITE 7: Audit Logs & Notifications Verification
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n📌 Suite 7: Audit Logs & Administrative Notifications');
  try {
    // 7.1 Notifications for CRM
    const notifsRes = await request('/notifications', {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    const notifs = notifsRes.data?.notifications || (Array.isArray(notifsRes.data) ? notifsRes.data : []);
    recordTest(
      'Suite 7: System Monitoring',
      'Admin Notifications Feed (/api/notifications)',
      notifsRes.ok && Array.isArray(notifs),
      { count: notifs.length, unreadCount: notifsRes.data?.unreadCount || 0 }
    );

    // 7.2 Audit Trail
    const auditRes = await request('/analytics/audit-logs', {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    const auditLogs = extractData<any[]>(auditRes.data);
    recordTest(
      'Suite 7: System Monitoring',
      'SuperAdmin Audit Trail Logs (/api/analytics/audit-logs)',
      auditRes.ok && Array.isArray(auditLogs),
      { count: Array.isArray(auditLogs) ? auditLogs.length : 0 }
    );
  } catch (err: any) {
    recordTest('Suite 7: System Monitoring', 'Audit & Notifs Execution', false, null, err.message);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SUITE 8: Database Cleanup of Test Data
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n📌 Suite 8: Automated Test Data Cleanup');
  try {
    let cleanups = 0;
    if (createdTourBookingId) {
      const delTour = await request(`/tours/bookings/${createdTourBookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${superAdminToken}` },
      });
      if (delTour.ok) cleanups++;
    }

    if (createdFleetBookingId) {
      const delFleet = await request(`/fleet/bookings/${createdFleetBookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${superAdminToken}` },
      });
      if (delFleet.ok) cleanups++;
    }

    if (createdInquiryId) {
      const delInq = await request(`/tours/inquiries/${createdInquiryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${superAdminToken}` },
      });
      if (delInq.ok) cleanups++;
    }

    recordTest(
      'Suite 8: Cleanup',
      'Automated Test Data Teardown (Zero clutter remaining)',
      cleanups >= 2,
      { recordsRemoved: cleanups }
    );
  } catch (err: any) {
    recordTest('Suite 8: Cleanup', 'Cleanup Execution', false, null, err.message);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // FINAL SCORECARD & SUMMARY
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n===============================================================');
  console.log('📊 E2E TEST SCORECARD SUMMARY');
  console.log('===============================================================');

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  const passRate = ((passed / total) * 100).toFixed(1);

  console.log(`Total Scenarios Executed: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Pass Rate: ${passRate}%`);
  console.log('===============================================================\n');

  if (failed > 0) {
    console.error(`💥 E2E Test Suite Completed with ${failed} failure(s).`);
    process.exit(1);
  } else {
    console.log('🎉 ALL END-TO-END WORKFLOWS PASSED WITH 100% SUCCESS!');
    process.exit(0);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal E2E test runner error:', err);
  process.exit(1);
});
