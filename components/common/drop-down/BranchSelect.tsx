import { Form, Select } from "antd";

import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import { useCallback, useEffect, useState } from "react";
import { IBranch } from "@/shared/model/branch/Branch";
import { getBranches } from "@/shared/services/branches/service-branch";

interface Props {
  label?: string;
  clearable?: boolean;
  labelAlign?: "left" | "right";
  value?: number;
  disabled?: boolean;
  onChange: (val: number) => void;
  localize: LocalizeFn;
  required?: boolean;
}

export const BranchSelect = (props: Props) => {
  const [branches, setBranches] = useState<IBranch[]>([]);
  const labelAlign = props.labelAlign || "left";

  const init = useCallback(async () => {
    const branches = await getBranches();
    if (branches) setBranches(branches);
  }, [setBranches]);

  useEffect(() => {
    init().then();
  }, []);

  return (
    <Form.Item
      labelAlign={labelAlign}
      label={props.label || props.localize("Branch")}
      rules={[{ required: props.required ?? false }]}
    >
      <Select
        style={{ width: "100%" }}
        onChange={(val: any) => props.onChange(Number(val || 0))}
        allowClear={props.clearable}
        showSearch
        optionFilterProp="children"
        disabled={props.disabled}
        value={props.value || undefined}
      >
        {branches?.map((x) => (
          <Select.Option title={x.fullName} key={x.id} value={x.id}>
            {x.nickName}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};
