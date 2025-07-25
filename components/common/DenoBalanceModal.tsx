// import "./Confirm.scss";
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { get } from "@/shared/services/ajaxService.ts";
import { LocalizeFn } from "@/shared/context/LocaleContext";

interface Prop {
  repoId?: number;
  localize: LocalizeFn;
}

interface CashDeno {
  Id: number;
  DenoName: string;
  DenoValue: number;
  Qty: number;
  Amount?: number;
}

const DenoBalanceModal = (props: Prop) => {
  const [state, setState] = useState<{
    denoRemaining: CashDeno[];
  }>({ denoRemaining: [] });

  const init = async () => {
    const deno = await get<CashDeno[]>(`/cash-deno/remaining/${props.repoId}`);
    if (deno) {
      setState({ ...state, denoRemaining: deno.data });
    }
  };
  const columns = [
    { title: props.localize("DenoName"), dataIndex: "DenoName", key: "Cash" },
    { title: props.localize("Quantity"), dataIndex: "Qty", key: "Qty" },
  ];
  useEffect(() => {
    init();
  }, [props.repoId]);

  const sortByProperty = (property: any) => {
    return (a: any, b: any) => {
      if (a[property] > b[property]) return 1;
      else if (a[property] < b[property]) return -1;
      return 0;
    };
  };

  return (
    <Table
      sortDirections={["descend"]}
      columns={columns as any}
      dataSource={state.denoRemaining.sort(sortByProperty("DenoId"))}
      pagination={false}
    />
  );
};

export default DenoBalanceModal;
