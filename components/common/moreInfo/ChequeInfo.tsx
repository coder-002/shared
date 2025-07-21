import Loader from "@/shared/components/Loader/Loader";
import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import { get } from "@/shared/services/ajaxService.ts";
import { Modal, Table } from "antd";
import React, { useState } from "react";
import { InfoCircleFilled } from "@ant-design/icons";
import { commaFormatNumber } from "@/shared/helper/numberHelper.ts";
import { ChequeIssueDetailView } from "@/shared/model/deposit/ChequeIssueDetailView";
import { Column } from "@/shared/components/common/crud/table";

interface DataItem {
  AccountNumber: string;
  Customer: string;
  Details: ChequeIssueDetailView[];
  EndOn: number;
  IssuedOn: string;
  ProductName: string;
  StartFrom: number;
}

interface Props {
  accountId: number;
  localize: LocalizeFn;
}

export const ChequeInfo = (props: Props) => {
  const [state, setState] = useState<{
    chequeModal?: boolean;
    data: DataItem[];
    loading?: boolean;
  }>({ data: [] });

  const columns: Column<DataItem>[] = [
    {
      title: props.localize("IssuedOn"),
      key: "IssuedOn",
      dataIndex: ["IssuedOn"],
    },
    {
      title: props.localize("Start"),
      key: "StartFrom",
      dataIndex: ["StartFrom"],
      align: "right",
    },
    {
      title: props.localize("End"),
      key: "EndOn",
      dataIndex: "EndOn",
      align: "right",
    },
    {
      title: props.localize("Account"),
      key: "AccountNumber",
      dataIndex: "AccountNumber",
    },
    {
      title: props.localize("Product"),
      key: "ProductName",
      dataIndex: "ProductName",
    },
  ];
  const expandRender = (item: DataItem) => {
    const dColumns: Column<ChequeIssueDetailView>[] = [
      {
        title: props.localize("ChequeHash"),
        key: "chequeNumber",
        dataIndex: "chequeNumber",
        align: "right",
      },
      {
        title: props.localize("Blocked"),
        key: "blocked",
        dataIndex: "blocked",
        className: "english",
        render: (val: any) => (
          <span>{val ? props.localize("Yes") : props.localize("No")}</span>
        ),
      },
      {
        title: props.localize("TranCode"),
        key: "tranCode",
        dataIndex: "tranCode",
        render: (val: any) => {
          if (val == undefined) return props.localize("NoDataFound");
          else return val;
        },
      },
      {
        title: props.localize("Amount"),
        key: "amount",
        dataIndex: "amount",
        align: "right",
        render: (val: any) => <span>{commaFormatNumber(val)}</span>,
      },
      {
        title: props.localize("Reference"),
        key: "statementReference",
        dataIndex: "statementReference",
      },
    ];

    return (
      <Table
        pagination={false}
        size="small"
        dataSource={item.Details}
        columns={dColumns as any}
      />
    );
  };
  const getData = async () => {
    const res = await get<DataItem[]>(
      // `/${"deposit"}/cheque/report/${props.accountId}/${0}`
      `/cheque/report/${props.accountId}/${0}`
    );
    if (res) {
      setState({ ...state, data: res.data, chequeModal: true });
    }
  };
  return (
    <>
      <InfoCircleFilled
        onClick={getData}
        title={props.localize("ChequeInfo")}
      />

      <Modal
        title={props.localize("ChequeHash")}
        okText={props.localize("Ok")}
        cancelText={props.localize("Cancel")}
        open={state.chequeModal == true}
        onCancel={() => setState({ ...state, chequeModal: false })}
        footer={null}
        width="70vw"
      >
        {state.loading ? <Loader /> : null}
        <Table
          size="small"
          pagination={false}
          dataSource={state.data}
          columns={columns as any}
          expandedRowRender={expandRender}
        />
      </Modal>
    </>
  );
};
