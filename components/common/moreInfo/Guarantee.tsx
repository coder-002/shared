import React from "react";
import { GuaranteeView } from "@/shared/model/loan/GuaranteeView.ts";
import { Table, Typography } from "antd";
import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import { commaFormatNumber } from "@/shared/helper/numberHelper.ts";
import { NonMemberGurantee } from "./MoreInfo";
import { Column } from "@/shared/components/common/crud/table";
// import { TbDatabaseX } from "react-icons/tb";

interface Props {
  custId: number;
  guarantee: GuaranteeView[];
  selfGuarantee: GuaranteeView[];
  nonMemberGuarantee: NonMemberGurantee[];
  localize: LocalizeFn;
}

const { Title } = Typography;
export const GuaranteeInfo = (props: Props) => {
  const { localize } = props;

  const nonMemberColumns: Column<NonMemberGurantee>[] = [
    {
      title: localize("LoanAccount"),
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    { title: localize("Name"), dataIndex: "name", key: "name" },
    {
      title: localize("ContactNumber"),
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    { title: localize("Address"), dataIndex: "address", key: "address" },
    { title: localize("Relation"), dataIndex: "relation", key: "relation" },
    {
      title: localize("CitizenshipNumber"),
      dataIndex: "citizenshipNumber",
      key: "citizenshipNumber",
    },
  ];

  const columns: Column<GuaranteeView>[] = [
    {
      title: localize("LoanAccount"),
      dataIndex: "loanAccount",
      key: "loanAccount",
    },
    {
      title: localize("Member"),
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: localize("Guarantee"),
      dataIndex: "depositAccount",
      key: "depositAccount",
      render: (val, rec) => <span>{val || rec.shareAccount}</span>,
    },
    {
      title: localize("Amount"),
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (val: any) => commaFormatNumber(val),
    },
  ];
  const Nodata = (
    <p
      style={{
        fontSize: "1.15rem",
        fontWeight: "bolder",
        display: "flex",
        alignItems: "center",
      }}
    >
      {localize("NoDataFound")}
    </p>
  );
  return (
    <div>
      <Title level={4}>{localize("GuaranteesForMember_", props.custId)}</Title>
      {props.guarantee && props.guarantee.length ? (
        <Table
          size="small"
          dataSource={props.guarantee}
          pagination={false}
          columns={columns as any}
        />
      ) : (
        <p>{localize("NoDataFound")}</p>
      )}

      <Title level={4}>
        {localize("GuaranteeForOtherLoans_", props.custId)}
      </Title>
      {props.selfGuarantee && props.selfGuarantee.length ? (
        <Table
          size="small"
          dataSource={props.selfGuarantee}
          pagination={false}
          columns={columns as any}
        />
      ) : (
        <p>{localize("NoDataFound")}</p>
      )}

      <Title level={4}>{localize("NonMemberGuarantee")}</Title>
      {props.nonMemberGuarantee && props.nonMemberGuarantee.length ? (
        <Table
          size="small"
          dataSource={props.nonMemberGuarantee}
          pagination={false}
          columns={nonMemberColumns as any}
        />
      ) : (
        <p>{localize("NoDataFound")}</p>
      )}
    </div>
  );
};
