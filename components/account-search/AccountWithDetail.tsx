import React, { useEffect, useState } from "react";
import AccountSearch from "./AccountSearch.tsx";

import { Form, FormItemProps, Switch, Tooltip, Typography } from "antd";
import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import { commaFormatNumber } from "@/shared/helper/numberHelper.ts";
import { MoreInfoHelp } from "../common/moreInfo/MoreInfo.tsx";
import { accountSearchInfoModel, depositAccountSearchDetail } from "@/shared/model/search/Search.ts";

const FormItem = Form.Item;

interface AccountProps {
  onChange: (
    val: number,
    info: depositAccountSearchDetail | accountSearchInfoModel
  ) => void;
  type: "deposit" | "loan" | "share";
  label?: React.ReactElement | string;
  activeOnly?: boolean;
  allBranches?: boolean;
  showDrawingPower?: boolean;
  branchId: number;
  value?: number;
  localize: LocalizeFn;
  acStatement?: boolean;
  removeActiveOnly?: boolean;
  onReset?: () => void;
  disabled?: boolean;
  extraFormItemProps?: FormItemProps;
  customerId?: number;
  limitAcToCustId?: boolean;
}

export const AccountWithDetail = (props: AccountProps) => {
  const [moreInfo, setMoreInfo] = useState<boolean>(false);
  const [accountId, setAccountId] = useState<number>(0);
  const [activeOnly, setActiveOnly] = useState<boolean>(true);
  const [accDetail, setAccDetail] = useState<depositAccountSearchDetail>();

  const handleChange = async (
    val: number,
    data?: depositAccountSearchDetail | accountSearchInfoModel
  ) => {
    if (!val) return;

    const accDetail = data as depositAccountSearchDetail;
    if (accDetail) {
      setAccDetail(accDetail);

      props.onChange(val, accDetail);
    }
  };

  const unauthorized = (
    <strong className={"color-error"}>{props.localize("Unauthorized")}</strong>
  );

  useEffect(() => {
    if (!props.value) {
      setAccDetail(undefined);
      setAccountId(0);
    }
  }, [props.value]);

  const balTxt = accDetail ? (
    <span>
      {props.localize("Bal")}:{" "}
      <Typography.Text code>
        {accDetail.hideBalWhiteList
          ? unauthorized
          : commaFormatNumber(accDetail.balance) || 0}
      </Typography.Text>
      {props.localize("DP")}:{" "}
      <Typography.Text code>
        {accDetail.hideBalWhiteList
          ? unauthorized
          : commaFormatNumber(accDetail.drawingPower) || 0}
      </Typography.Text>
    </span>
  ) : (
    ""
  );

  // const balTxt = state.accInfo ? <span>{props.localize("Bal")}: <Typography.Text code>{accWhiteListBal ? (commaFormatNumber(state.accInfo.balance) || 0) : unauthorized}</Typography.Text>{props.localize("DP")}: <Typography.Text code>{accWhiteListBal ? ((state.accInfo.is_fd && !state.accInfo.is_recurring && !state.accInfo.is_matured ? 0 : commaFormatNumber(state.accInfo.drawing_power) || 0)) : unauthorized}</Typography.Text></span> : ''
  const label = props.label || props.localize("Account");

  return (
    <FormItem
      {...props.extraFormItemProps}
      label={
        !props.customerId && (
          <span
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <span>{label}&nbsp;&nbsp;</span>
            {props.removeActiveOnly ? null : (
              <Tooltip title={props.localize("OnlyActiveAcc")}>
                <span style={{ float: "right" }}>
                  <Switch
                    checked={activeOnly}
                    onChange={setActiveOnly}
                    style={{ float: "right" }}
                    size="small"
                  />
                </span>
              </Tooltip>
            )}
          </span>
        )
      }
      help={
        accDetail ? (
          <small>
            <strong>
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <MoreInfoHelp
                  localize={props.localize}
                  onShow={() => setMoreInfo(true)}
                  title={balTxt}
                />
                <span>
                  {accDetail.childName
                    ? accDetail.customerName + "(" + accDetail.childName + ")"
                    : accDetail.customerName || ""}
                </span>
              </span>
            </strong>
          </small>
        ) : null
      }
    >
      <AccountSearch
        disabled={props.disabled}
        localize={props.localize}
        allBranches={
          props.allBranches === undefined || props.allBranches || false
        }
        moreInfo={moreInfo}
        value={props.value}
        onReset={() => {
          setAccDetail(undefined);
          setAccountId(0);
          if (props.onReset) props.onReset();
        }}
        acStatement={props.acStatement}
        hideMoreInfo={() => setMoreInfo(false)}
        onChange={handleChange}
        type={props.type}
        activeOnly={props.activeOnly ? props.activeOnly : activeOnly}
        branchId={props.branchId}
        customerId={props.customerId}
        limitAcToCustId={props.limitAcToCustId}
        label={props.localize("Account")}
      />
    </FormItem>
  );
};
