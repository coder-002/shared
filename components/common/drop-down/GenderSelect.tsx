import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";
import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import { Gender } from "@/shared/model/customer/PersonalProfileInit";
import { getGenders } from "@/shared/services/dropdownservice/dropdownService";

const FormItem = Form.Item;

interface Props {
  label?: string;
  clearable?: boolean;
  onChange: (val: number) => void;
  value?: number;
  localize: LocalizeFn;
}

export const GenderSelect = (props: Props) => {
  const [genders, setGenders] = useState<Gender[]>([]);

  const init = async () => {
    const genders = await getGenders();
    if (genders) setGenders(genders);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <FormItem labelAlign="left" label={props.label || props.localize("Gender")}>
      <Select
        showSearch
        optionFilterProp="children"
        value={props.value || undefined}
        onChange={(val: any) => props.onChange(Number(val || 0))}
        allowClear={props.clearable}
      >
        {genders.map((x) => (
          <Select.Option key={x.id} value={x.id}>
            {x.genderName}
          </Select.Option>
        ))}
      </Select>
    </FormItem>
  );
};
