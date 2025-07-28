import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";
import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import { get } from "@/shared/services/ajaxService.ts";
import { IBranch } from "@/shared/model/branch/Branch";
import { getBranches } from "@/shared/services/branches/service-branch";

const FormItem = Form.Item;

interface Props {
  label?: string;
  clearable?: boolean;
  value?: number;
  disabled?: boolean;
  onChange: (val: number) => void;
  localize: LocalizeFn;
  branchId: number;
}

export const FinalReportBranchSelect = (props: Props) => {
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [allowClear, setAllowClear] = useState<boolean>();
  const init = async () => {
    const [branches, allowClear] = await Promise.all([
      getBranches(),
      get<string>("/core-parameter/allow-clearable-branch"),
    ]);
    if (branches && allowClear) {
      setBranches(branches.filter((x: any) => x.Id == props.branchId));
      setAllowClear(allowClear.data == "TRUE" ? true : false);
    }
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <FormItem labelAlign="left" label={props.label || props.localize("Branch")}>
      <Select
        onChange={(val: any) => props.onChange(Number(val || 0))}
        allowClear={allowClear ? true : false}
        showSearch
        optionFilterProp="children"
        disabled={props.disabled}
        value={props.value || undefined}
      >
        {branches.map((x: any) => (
          <Select.Option title={x.BranchName} key={x.Id} value={x.Id}>
            {x.BranchName}
          </Select.Option>
        ))}
      </Select>
    </FormItem>
  );
};
