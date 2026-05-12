export const QUESTIONNAIRE_SECTIONS = [
  {
    id: 'risk-need',
    title: 'Risk Need',
    questionIds: [
      'target_future_value',
      'current_portfolio_value',
      'annual_net_cash_flow',
      'investment_time_horizon_years',
    ],
  },
  {
    id: 'risk-tolerance',
    title: 'Risk Tolerance',
    questionIds: ['expects_high_withdrawal_rate', 'has_stable_external_income'],
  },
  {
    id: 'behavioral-loss-tolerance',
    title: 'Behavioral Loss Tolerance',
    questionIds: [
      'willingness_to_take_risk',
      'safety_vs_return_preference',
      'financial_knowledge_level',
      'investment_experience_level',
      'market_risk_perception',
      'reaction_to_losses_score',
    ],
  },
];

function getQuestionId(item) {
  return item?.questionIdCfa ?? item?.question_id_cfa ?? item?.question_id ?? null;
}

export function groupQuestionnaireItems(items = []) {
  const itemMap = new Map();

  items.forEach((item) => {
    const questionId = getQuestionId(item);
    if (questionId) {
      itemMap.set(questionId, item);
    }
  });

  return QUESTIONNAIRE_SECTIONS.map((section) => ({
    ...section,
    items: section.questionIds
      .map((questionId) => itemMap.get(questionId))
      .filter(Boolean),
  })).filter((section) => section.items.length > 0);
}