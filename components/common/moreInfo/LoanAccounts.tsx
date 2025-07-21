import React from "react";
import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import { commaFormatNumber } from "@/shared/helper/numberHelper.ts";
import { showErrorMessage } from "@/shared/helper/message-helper/messageHelper";
import { CustomerInfoLoanAccount } from "@/shared/model/customer/Customer";
import Loader from "@/shared/components/Loader/Loader";

const LoanAccounts = (props: {
  data: CustomerInfoLoanAccount[];
  localize: LocalizeFn;
  loading: boolean;
}) => {
  const finalData: CustomerInfoLoanAccount[] = [];
  props.data?.forEach((x) => {
    finalData.push(x);
    finalData.push({
      accountNumber: "~",
      branch: "~",
      drawingPower: JSON.parse(x.drawingPower as any),
      id: 0,
      product: "~",
      amount: 0,
      balance: 0,
      duration: 0,
      interestRate: 0,
      issuedOnNp: "~",
      acWhiteListShowBal: x.acWhiteListShowBal,
    });
  });

  const { localize } = props;
  const handleDp = (
    x: CustomerInfoLoanAccount,
    d: { f1: string; f2: string }
  ) => {
    if (d.f1 == "Drawing Power" && !x.acWhiteListShowBal) {
      return (
        <span>
          {d.f1}: {props.localize("Unauthorized")} &nbsp;
        </span>
      );
    }
    return d.f2 && d.f1 && d.f2 != "0.00" ? (
      <span>
        {d.f1}: <strong>{d.f2}</strong>&nbsp;
      </span>
    ) : (
      <span></span>
    );
  };
  return (
    <div style={{ overflow: "scroll" }}>
      {props.loading ? (
        <Loader />
      ) : props.data && props.data.length > 0 ? (
        <table className="Account-table">
          <thead>
            <tr>
              <th>{localize("Branch")}</th>
              <th>{localize("IssuedOn")}</th>
              <th>{localize("Account")}</th>
              <th>{localize("Product")}</th>
              <th>{localize("Investment")}</th>
              <th>{localize("Duration")}</th>
              <th>{localize("Interest")}</th>
              <th style={{ textAlign: "right", paddingRight: "10px" }}>
                {localize("Balance")}
              </th>
              <th>{localize("PassbookVerifiedOn")}</th>
            </tr>
          </thead>
          <tbody>
            {finalData.map((x) =>
              x.accountNumber == "~" ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{ background: "#ccc", textAlign: "right" }}
                  >
                    <span>
                      {x.drawingPower.map((d: any) => handleDp(x, d))}
                    </span>
                  </td>
                </tr>
              ) : (
                <tr
                  className="more-info-tr-hover"
                  style={{ cursor: "pointer" }}
                  onDoubleClick={() => {
                    x.acWhiteListShowBal
                      ? window.open(`/rpt/loan/loanaccountstatement?id=${x.id}`)
                      : showErrorMessage("Unauthorized");
                  }}
                >
                  <td>{x.branch}</td>
                  <td>{x.issuedOnNp}</td>
                  <td>{x.accountNumber}</td>
                  <td>{x.product}</td>
                  <td>
                    {x.acWhiteListShowBal
                      ? commaFormatNumber(x.amount || 0)
                      : props.localize("Unauthorized")}
                  </td>
                  <td>{x.duration}</td>
                  <td>{x.interestRate}</td>
                  <td style={{ textAlign: "right", paddingRight: "10px" }}>
                    {x.acWhiteListShowBal
                      ? commaFormatNumber(x.balance || 0)
                      : props.localize("Unauthorized")}
                  </td>
                  <td>{x.passbookVerified}</td>
                </tr>
              )
            )}
            <tr>
              <td colSpan={7} style={{ textAlign: "right" }}>
                {" "}
                {localize("Total")}{" "}
              </td>
              <td style={{ textAlign: "right", paddingRight: "10px" }}>
                {commaFormatNumber(
                  finalData
                    .filter(
                      (x) => x.accountNumber != "~" && x.acWhiteListShowBal
                    )
                    .reduce((a, v) => (a = a + v.balance), 0) || 0
                )}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>{localize("NoDataFound")}</p>
      )}
    </div>
  );
};
export { LoanAccounts };
