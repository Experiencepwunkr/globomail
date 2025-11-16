// In VALIDATORS object in /api/services/[service]/submit/route.ts
cac: (data) => {
  if (!data.companyName1 || !data.companyEmail || !data.category) {
    return 'Company name, email, and category are required.';
  }
  if (!data.proprietors || data.proprietors.length === 0) {
    return 'At least one proprietor is required.';
  }
  return null;
},