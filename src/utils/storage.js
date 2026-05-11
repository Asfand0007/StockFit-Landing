export function getStoredRiskTier() {
  const raw = sessionStorage.getItem('latestRiskAssessment');

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);

    return (
      parsed.portfolio_tier ||
      parsed.assessed_risk ||
      parsed.risk_need_tier ||
      parsed.risk_capacity_tier ||
      parsed.behavioral_risk_tier ||
      null
    );
  } catch {
    return null;
  }
}