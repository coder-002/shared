import React, { useEffect, useState } from "react";
import { Form, FormItemProps, Select, Switch, Tooltip } from "antd";

import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import { IEmployee } from "@/shared/model/employee/employee";
import {
  getCollectors,
  getCollectorsById,
} from "@/shared/services/collectors/service-collectors";

const FormItem = Form.Item;

interface Props {
  label?: string;
  labelAlign?: "left" | "right";
  clearable?: boolean;
  onChange: (val: number) => void;
  value?: number;
  localize: LocalizeFn;
  hideSwitch?: boolean;
  extraFormItemProps?: FormItemProps;
  branchId?: number;
  disabled?: boolean;
}

export const CollectorSelect = (props: Props) => {
  const labelAlign = props.labelAlign || "right";
  const [collectors, setCollectors] = useState<IEmployee[]>([]);
  const [state, setState] = useState<{
    activeOnly: boolean;
  }>({
    activeOnly: true,
  });
  const init = async () => {
    if (state.activeOnly == true) {
      if (props.branchId) {
        const res = await getCollectorsById(true, props.branchId);
        if (res) setCollectors(res);
      } else {
        const res = await getCollectors(true, false);
        if (res) setCollectors(res);
      }
    } else if (state.activeOnly == false) {
      if (props.branchId) {
        const res = await getCollectorsById(false, props.branchId);
        if (res) setCollectors(res);
      } else {
        const res = await getCollectors(true, false);
        if (res) setCollectors(res);
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    init();
  }, [state.activeOnly, props.branchId]);

  const label = <span>{props.label || props.localize("Collector")}</span>;
  return (
    <FormItem
      {...props.extraFormItemProps}
      labelAlign={labelAlign}
      name="collectorId"
      label={
        <>
          {label}
          {props.hideSwitch ? null : (
            <Tooltip title={props.localize("OnlyActiveAcc")}>
              <Switch
                style={{ float: "right", margin: "2px" }}
                checked={state.activeOnly}
                onChange={(checked: any) => {
                  if (checked) {
                    setState({ ...state, activeOnly: true });
                  } else {
                    setState({ ...state, activeOnly: false });
                  }
                }}
                size="small"
              />
            </Tooltip>
          )}
        </>
      }
    >
      <Select
        value={props.value || undefined}
        onChange={(val: any) => props.onChange(Number(val || 0))}
        showSearch
        optionFilterProp="children"
        allowClear={props.clearable}
        disabled={props.disabled}
      >
        {collectors.map((x) => (
          <Select.Option title={x.employeeName} key={x.id} value={x.id}>
            {x.employeeName}
          </Select.Option>
        ))}
      </Select>
    </FormItem>
  );
};
