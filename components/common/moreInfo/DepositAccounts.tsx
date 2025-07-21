import { useState } from "react";
import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import { Button, Modal } from "antd";
import { commaFormatNumber } from "@/shared/helper/numberHelper.ts";
import { showErrorMessage } from "@/shared/helper/message-helper/messageHelper.ts";
import { TerminatedAccount } from "@/shared/model/deposit/TerminatedAccount.ts";
import { CustomerInfoDepAccount } from "@/shared/model/customer/Customer.ts";
import { ReportFrame } from "@/shared/components/common/ReportFrame.tsx";
import { ChequeInfo } from "./ChequeInfo";
import Loader from "@/shared/components/Loader/Loader";

const DepositAccounts = (props: {
  data: CustomerInfoDepAccount[];
  localize: LocalizeFn;
  loading: boolean;
}) => {
  const [state, setState] = useState<{
    loading: boolean;
    reportUrl?: string;
  }>({
    loading: false,
  });

  const finalData: CustomerInfoDepAccount[] = [];
  const [terminate, setTerminate] = useState<TerminatedAccount>();
  props?.data?.forEach(async (x) => {
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
      instAmt: 0,
      acWhiteListShowBal: x.acWhiteListShowBal,
    });
  });
  const handleDp = (
    x: CustomerInfoDepAccount,
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
      <span style={{ display: "flex", alignItems: "end" }}>
        <span>{d.f1}: </span>
        <strong>{d.f2}&nbsp;</strong>
      </span>
    ) : (
      <span></span>
    );
  };

  return (
    <div style={{ overflow: "scroll" }}>
      {props.loading ? (
        <Loader />
      ) : props.data.length ? (
        <table className="Account-table">
          <thead>
            <tr>
              <th>{props.localize("Branch")}</th>
              <th>{props.localize("AcOpened")}</th>
              <th>{props.localize("Account")}</th>
              <th>{props.localize("Product")}</th>
              <th>{props.localize("Collector")}</th>
              <th>{props.localize("Duration")}</th>
              <th>{props.localize("IntNominee")}</th>
              <th style={{ textAlign: "right", paddingRight: "10px" }}>
                {props.localize("Balance")}
              </th>
              <th style={{ textAlign: "right", paddingRight: "10px" }}>
                {props.localize("IntBalance")}
              </th>
              <th>{props.localize("PassbookVerifiedOn")}</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {finalData.map((x) =>
              x.accountNumber == "~" ? (
                <tr>
                  <td colSpan={12}>
                    <span
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      {x.accountNominee ? (
                        <strong style={{}}>
                          {props.localize("Nominee")}: {x.accountNominee} (
                          {x.accountNomineeRel})&nbsp;&nbsp;
                        </strong>
                      ) : null}
                      <span
                        style={{
                          display: "flex",
                        }}
                      >
                        {x.drawingPower.map((d: any) => handleDp(x, d))}
                      </span>
                    </span>
                  </td>
                  {/* <td
										colSpan={12}
										style={{ background: "#ccc", textAlign: "right" }}
									>
										<span></span>
									</td> */}
                </tr>
              ) : (
                <tr
                  className="more-info-tr-hover"
                  style={{ cursor: "pointer" }}
                  onDoubleClick={() =>
                    x.acWhiteListShowBal
                      ? window.open(
                          `/rpt/deposit/depositaccountstatement?id=${x.id}`
                        )
                      : showErrorMessage("Unauthorized")
                  }
                >
                  <td>{x.branch}</td>
                  <td>{x.creationDateNp}</td>
                  <td>{x.accountNumber}</td>
                  <td>{x.product}</td>
                  <td>{x.collector}</td>
                  <td>{x.accountDuration}</td>
                  <td>{x.interestNomineeAccountNumber}</td>
                  <td style={{ textAlign: "right", paddingRight: "10px" }}>
                    {x.acWhiteListShowBal
                      ? commaFormatNumber(x.balance || 0)
                      : props.localize("Unauthorized")}
                  </td>
                  <td style={{ textAlign: "right", paddingRight: "10px" }}>
                    {x.acWhiteListShowBal
                      ? commaFormatNumber(x.intBal || 0)
                      : props.localize("Unauthorized")}
                  </td>
                  <td>{x.passbookVerified}</td>
                  <td>
                    {<ChequeInfo localize={props.localize} accountId={x.id} />}
                  </td>
                  <td>
                    {Number(x.instAmt || 0) > 0 ? (
                      <Button
                        size="small"
                        type="link"
                        onClick={() =>
                          setState({
                            loading: true,
                            reportUrl: `/rdlc/dep-inst-report?AccountId=${x.id}`,
                            // reportUrl: `/rdlc/dep-inst-report?AccountId=${x.id}`,
                          })
                        }
                      >
                        {props.localize("DepositInstallmentReport")}
                      </Button>
                    ) : null}
                  </td>
                </tr>
              )
            )}
            <tr>
              <td colSpan={7} style={{ textAlign: "right" }}>
                {" "}
                {props.localize("Total")}{" "}
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
        <p>{props.localize("NoDataFound")}</p>
      )}
      <Modal
        okText={props.localize("Ok")}
        cancelText={props.localize("Cancel")}
        open={state.reportUrl !== undefined}
        onCancel={() => setState({ ...state, reportUrl: undefined })}
        footer={null}
        width="90vw"
      >
        {state.loading ? <Loader /> : null}
        <ReportFrame
          onLoaded={() => setState({ ...state, loading: false })}
          url={state.reportUrl || ""}
        />
      </Modal>
    </div>
  );
};
export { DepositAccounts };
