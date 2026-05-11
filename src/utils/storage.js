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

export function getStoredRiskAssessment() {
  const raw = sessionStorage.getItem('latestRiskAssessment');

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getStoredQuestionnaireId() {
  const storedAssessment = getStoredRiskAssessment();

  return (
    storedAssessment?.questionnaire_id ||
    storedAssessment?.questionnaireId ||
    storedAssessment?.id ||
    null
  );
}

export function getStoredPortfolio() {
  const raw = sessionStorage.getItem('latestPortfolio');

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredPortfolio(portfolio) {
  sessionStorage.setItem('latestPortfolio', JSON.stringify(portfolio));
}