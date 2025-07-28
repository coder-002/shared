import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";
import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import { ChartOfAccount } from "@/shared/model/account/ChartOfAccount";
import { getGroupAccounts } from "@/shared/services/dropdownservice/dropdownService";

const FormItem = Form.Item;

interface Props {
  label?: string;
  clearable?: boolean;
  onChange: (val: number) => void;
  value?: number;
  localize: LocalizeFn;
}

export const GlGroupSelect = (props: Props) => {
  const [state, setState] = useState<{
    data: ChartOfAccount[];
  }>({ data: [] });

  const init = async () => {
    const res = await getGroupAccounts();
    if (res) setState({ ...state, data: res });
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <FormItem
      labelAlign="left"
      label={props.label || props.localize("GlAccount")}
    >
      <Select
        value={props.value || undefined}
        showSearch
        allowClear={props.clearable}
        optionLabelProp="children"
        optionFilterProp="children"
        onChange={(val: any) => props.onChange(Number(val || 0))}
      >
        {state.data.map((x: any) => (
          <Select.Option title={x.accountName} key={x.id} value={x.id}>
            {x.accountName}
          </Select.Option>
        ))}
      </Select>
    </FormItem>
  );
};
