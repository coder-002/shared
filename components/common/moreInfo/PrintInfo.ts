import { commaFormatNumber } from "@/shared/helper/numberHelper.ts";
import { AccountModel } from "./MoreInfo";
import { CustomerInfoDepAccount, CustomerInfoLoanAccount } from "@/shared/model/customer/Customer";

const accountInfoPrint = (accountData: AccountModel | undefined) => {
  const shareFinalData: CustomerInfoDepAccount[] = [];
  accountData?.share.forEach((x) => {
    shareFinalData.push(x);
    shareFinalData.push({
      accountNumber: "~",
      branch: "~",
      drawingPower: JSON.parse(x.drawingPower as any),
      creationDateNp: "~",
      id: 0,
      product: "~",
      balance: 0,
      collector: "",
      acWhiteListShowBal: x.acWhiteListShowBal,
    });
  });

  const loanFinalData: CustomerInfoLoanAccount[] = [];
  accountData?.loan.forEach((x) => {
    loanFinalData.push(x);
    loanFinalData.push({
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

  const finalData: CustomerInfoDepAccount[] = [];
  accountData?.deposit.forEach((x) => {
    finalData.push(x);
    finalData.push({
      accountNumber: "~",
      branch: "~",
      collector: "~",
      drawingPower: JSON.parse(x.drawingPower as any),
      creationDateNp: "~",
      id: 0,
      product: "~",
      accountNominee: x.accountNominee,
      accountNomineeRel: x.accountNomineeRel,
      balance: 0,
      passbookVerified: "",
      intBal: 0,
      acWhiteListShowBal: x.acWhiteListShowBal,
    });
  });

  const handleDp = (
    x: CustomerInfoDepAccount | CustomerInfoLoanAccount,
    d: { f1: string; f2: string }
  ) => {
    if (d.f1 == "Drawing Power" && !x.acWhiteListShowBal) {
      return `<span>${d.f1}: Unauthorized &nbsp;</span>`;
    }
    return d.f2 && d.f1 && d.f2 != "0.00"
      ? `<span>${d.f1}: <strong>${d.f2}</strong>&nbsp;</span>`
      : `<span></span>`;
  };

  let html = "";

  if (accountData && accountData.deposit.length > 0) {
    html += ` <div>
        <h3 style="text-align: center">Deposit</h3>
        <table style="width: 100%; border: 1px solid #aaa"> 
        <thead>
            <tr>
                <th>Branch</th>
                <th> AC Opened </th>
                <th> Account </th>
                <th> Product </th>
                <th> Collector </th>
                <th> Duration </th>
                <th> Int.Nominee </th>
                <th style ="text-align: right; padding-right: 10px"> Balance </th>
                <th style ="text-align: right; padding-right: 10px"> Int.Balance </th>
                <th> Passbook Verified On </th>
            </tr>
        </thead>
    <tbody>`;

    html += finalData.map((x) =>
      x.accountNumber == "~"
        ? `<tr style="width: 100%; border: 1px solid #aaa">
        <td style="width: 100%; border: 1px solid #aaa" colSpan="10" style="background: '#ccc'; text-align: right">
            <span>${
              x.accountNominee
                ? `<strong>Nominee: ${x.accountNominee} (${x.accountNomineeRel})&nbsp;&nbsp;</strong>`
                : " "
            }
                ${x.drawingPower.map((d: any) => handleDp(x, d))}</span>
        </td>
        
    </tr>`
        : `<tr style="width: 100%; border: 1px solid #aaa">
            <td>${x.branch}</td>
            <td>${x.creationDateNp}</td>
            <td>${x.accountNumber}</td>
            <td>${x.product}</td>
            <td>${x.collector}</td>
            <td>${x.accountDuration}</td>
            <td>${x.interestNomineeAccountNumber}</td>
            <td style="text-align: right; padding-right: 10px">${
              x.acWhiteListShowBal
                ? commaFormatNumber(x.balance || 0)
                : "Unauthorized"
            }</td>
            <td style="text-align: right; padding-right: 10px">${
              x.acWhiteListShowBal
                ? commaFormatNumber(x.intBal || 0)
                : "Unauthorized"
            }</td>
            <td>${x.passbookVerified}</td>
        </tr>`
    );

    html += `
    <tr style="width: 100%; border: 1px solid #aaa">
                <td colSpan="7" style="text-align: right"> Total: </td>
                <td style="text-align: right; padding-right: 10px ">
                    ${commaFormatNumber(
                      finalData
                        .filter(
                          (x) => x.accountNumber != "~" && x.acWhiteListShowBal
                        )
                        .reduce((a, v) => (a = a + v.balance), 0)
                    )}
                </td>
                <td style="text-align: right; padding-right: 10px">
                    ${commaFormatNumber(
                      finalData
                        .filter(
                          (x) => x.accountNumber != "~" && x.acWhiteListShowBal
                        )
                        .reduce((a, v) => (a = a + Number(v.intBal || 0)), 0)
                    )}
                </td>
                <td></td>
            </tr>
        </tbody>
    </table>
    </div>
    <br/>
    `;
  }

  if (accountData && accountData.loan.length > 0) {
    html += `
        <div>
        <h3 style="text-align: center">Loan</h3>
        <table style="width: 100%; border: 1px solid #aaa"> 
        <thead>
            <tr>
                <th>Branch</th>
                <th>Issued On</th>
                <th>Account</th>
                <th>Product</th>
                <th>Investment</th>
                <th>Duration</th>
                <th>Interest</th>
                <th style="text-align: right, padding-right: 10px ">Balance</th>
                <th>Passbook Verified</th>
            </tr>
        </thead>
        <tbody>
            ${loanFinalData.map((x) =>
              x.accountNumber == "~"
                ? `<tr style="width: 100%; border: 1px solid #aaa">
                <td colSpan="10" style="background: '#ccc', text-align: right ">
                    <span>${x.drawingPower.map((d: any) =>
                      handleDp(x, d)
                    )}</span>
                </td>
            </tr> `
                : `<tr style="width: 100%; border: 1px solid #aaa">
                    <td>${x.branch}</td>
                    <td>${x.issuedOnNp}</td>
                    <td>${x.accountNumber}</td>
                    <td>${x.product}</td>
                    <td>${x.acWhiteListShowBal ? x.amount : "Unauthorized"}</td>
                    <td>${x.duration}</td>
                    <td>${x.interestRate}</td>
                    <td style="text-align: right, padding-right: 10px ">${
                      x.acWhiteListShowBal
                        ? commaFormatNumber(x.balance || 0)
                        : "Unauthorized"
                    }</td>
                    <td>${x.passbookVerified}</td>
                </tr>`
            )}

            <tr style="width: 100%; border: 1px solid #aaa">
                <td colSpan="4" style="text-align: right "> Total: </td>
                <td style="text-align: 'center', padding-right: 10px ">
                    ${commaFormatNumber(
                      loanFinalData
                        .filter(
                          (x: any) =>
                            x.AccountNumber != "~" && x.AcWhiteListShowBal
                        )
                        .reduce((a, v) => (a = a + v.amount), 0)
                    )}
                </td>
                <td></td>
                <td></td>
                <td style="text-align: right, padding-right: 10px ">
                    ${commaFormatNumber(
                      loanFinalData
                        .filter(
                          (x) => x.accountNumber != "~" && x.acWhiteListShowBal
                        )
                        .reduce((a, v) => (a = a + Number(v.balance || 0)), 0)
                    )}
                </td>
                <td></td>
            </tr>
        </tbody>
    </table>
    </div>
        `;
  }

  if (accountData && accountData.share.length > 0) {
    html += `
        <div>
        <h3 style="text-align: center">Share</h3>
        <table style="width: 100%; border: 1px solid #aaa"> 
        <thead>
            <tr>
                <th>Branch</th>
                <th>A/C Opened</th>
                <th>Account</th>
                <th>Product</th>
                <th style="text-align: right, padding-right: 10px ">Balance</th>
            </tr>
        </thead>
        <tbody>
            ${shareFinalData.map((x) =>
              x.accountNumber == "~"
                ? `<tr style="width: 100%; border: 1px solid #aaa">
                <td colSpan="5" style="background: '#ccc', text-align: right ">
                    <span>${x.drawingPower.map((d: any) =>
                      handleDp(x, d)
                    )}</span>
                </td>
            </tr>`
                : `<tr style="width: 100%; border: 1px solid #aaa">
                    <td>${x.branch}</td>
                    <td>${x.creationDateNp}</td>
                    <td>${x.accountNumber}</td>
                    <td>${x.product}</td>
                    <td style="text-align: right, padding-right: 10px ">${
                      x.acWhiteListShowBal
                        ? commaFormatNumber(x.balance || 0)
                        : "Unauthorized"
                    }</td>
                </tr>`
            )}

    <tr style="width: 100%; border: 1px solid #aaa">
        <td colSpan="4" style = "text-align: right"> Total: </td>
            <td style = "text-align: right, padding-right: 10px">
                ${commaFormatNumber(
                  shareFinalData
                    .filter(
                      (x) => x.accountNumber != "~" && x.acWhiteListShowBal
                    )
                    .reduce((a, v) => (a = a + v.balance), 0)
                )}
    </td>
        </tr>
        </tbody>
        </table>       
        </div>
            `;
  }
  return html;
};

export { accountInfoPrint };
