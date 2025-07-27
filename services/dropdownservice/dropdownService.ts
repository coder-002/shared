import { get } from "../ajaxService";
import { Product as LoanProduct } from "@/shared/model/loan/Product";
import { Product as DepProduct } from "@/shared/model/deposit/Product";
import { Product as ShareProducts } from "@/shared/model/share/Product";
import { CashRepository } from "@/shared/model/repository/CashRepository";

const getDepositProducts = async (activeOnly: boolean) => {
  if (activeOnly) {
    const res = await get<DepProduct[]>("/dep-prod/active");
    return res && res.data;
  } else {
    const res = await get<DepProduct[]>("/dep-prod");
    return res && res.data;
  }
};

const getLoanProducts = async (activeOnly: boolean) => {
  if (activeOnly) {
    const res = await get<LoanProduct[]>("/loan-prod/active-only");
    return res && res.data;
  } else {
    const res = await get<LoanProduct[]>("/loan-prod");
    return res && res.data;
  }
};

const getShareProducts = async (activeOnly: boolean) => {
  if (activeOnly) {
    const res = await get<ShareProducts[]>("/share-product/active");
    return res && res.data;
  } else {
    const res = await get<ShareProducts[]>("/share-product");
    return res && res.data;
  }
};

const getCashRepositories = async () => {
  const res = await get<CashRepository[]>("/cash-repository");
  return res && res.data;
};

const getMyAllRepos = async () => {
  const res = await get<CashRepository[]>("/cash-repository/my-repos");
  return res && res.data;
};

export {
  getDepositProducts,
  getLoanProducts,
  getShareProducts,
  getCashRepositories,
  getMyAllRepos,
};
