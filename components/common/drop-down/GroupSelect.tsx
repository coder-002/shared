import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";
import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import { Group } from "@/shared/model/customer/Group";
import { getCustomerGroups } from "@/shared/services/dropdownservice/dropdownService";

const FormItem = Form.Item;

interface Props {
  clearable?: boolean;
  onChange: (val: number, groupName?: string) => void;
  value?: number;
  localize: LocalizeFn;
  required?: boolean;
}

export const GroupSelect = (props: Props) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const init = async () => {
    const groups = await getCustomerGroups();
    if (groups) {
      setLoading(false);
      setGroups(groups);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange = (val: any) => {
    const gId = Number(val || 0);
    const item = groups.filter((x: any) => x.id == gId)[0];
    if (item) props.onChange(gId, item.groupName);
    else {
      props.onChange(gId, undefined);
    }
  };

  return (
    <FormItem
      label={props.localize("Group")}
      required={props.required || false}
    >
      <Select
        value={props.value || undefined}
        onChange={handleChange}
        showSearch
        optionFilterProp="children"
        allowClear={props.clearable}
        loading={loading}
      >
        {groups.map((x: any) => (
          <Select.Option key={x.id} value={x.id}>
            {x.groupName}
          </Select.Option>
        ))}
      </Select>
    </FormItem>
  );
};
