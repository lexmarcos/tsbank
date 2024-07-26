import {
  AccountEntity,
  AccountOptions,
} from 'src/modules/account/account.entity';

import {
  MAXIMUM_NEGATIVE_BALANCE_ALLOWED,
  MAXIMUM_NEGATIVE_BALANCE_ALLOWED_TO_BONUS_ACCOUNT,
} from 'src/utils/accounts/constants';

type operationBetweenAccountsTypes = 'credit' | 'transfer';

interface IcalculateBonusByOperationTypeAttributes {
  operationType: operationBetweenAccountsTypes;
  value: number;
}

export function calculateBonusByOperationType(
  param: IcalculateBonusByOperationTypeAttributes,
) {
  if (param.operationType === 'credit') {
    return Math.trunc(param.value / 100);
  }

  if (param.operationType === 'transfer') {
    return Math.trunc(param.value / 150);
  }
}

interface IAddPointsToBonusAccountAttributes
  extends IcalculateBonusByOperationTypeAttributes {
  currentBonusAccount: number;
}

export function addPointsToBonusAccount(
  param: IAddPointsToBonusAccountAttributes,
) {
  return (
    param.currentBonusAccount +
    calculateBonusByOperationType({
      operationType: param.operationType,
      value: param.value,
    })
  );
}

export function isDefaultAccount(accountType: AccountOptions) {
  return accountType === 'Default';
}

export function isBonusAccount(accountType: AccountOptions) {
  return accountType === 'Bonus';
}

export function isDefaultAccountWithExcessiveDebt(
  account: AccountEntity,
  amount: number,
) {
  if (!isDefaultAccount(account.type)) {
    return false;
  }

  const newBalance = account.balance - amount;
  return newBalance < MAXIMUM_NEGATIVE_BALANCE_ALLOWED;
}

export function isBonusAccountWithExcessiveDebt(
  account: AccountEntity,
  amount: number,
) {
  if (!isBonusAccount(account.type)) {
    return false;
  }

  const newBalance = account.balance - amount;
  return newBalance < MAXIMUM_NEGATIVE_BALANCE_ALLOWED_TO_BONUS_ACCOUNT;
}
