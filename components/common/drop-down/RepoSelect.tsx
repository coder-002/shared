import React, { useEffect, useState } from "react";
import { Form, Modal, Select } from "antd";
import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import { CashRepository } from "@/shared/model/repository/CashRepository";
import DenoBalanceModal from "../DenoBalanceModal";
import { getCashRepositories } from "@/shared/services/dropdownservice/dropdownService";
import { get } from "@/shared/services/ajaxService";

const FormItem = Form.Item;

interface Props {
  label?: string;
  clearable?: boolean;
  onChange: (val: number) => void;
  value?: number;
  localize: LocalizeFn;
}

export const RepoSelect = (props: Props) => {
  const [show, setShow] = useState<boolean>(false);
  const [repos, setRepos] = useState<CashRepository[]>([]);

  const [isCashDeno, setIsCashDeno] = useState<boolean>();

  const init = async () => {
    const [repos, cashDeno] = await Promise.all([
      getCashRepositories(),
      get<string>("/core-parameter/cash-deno"),
    ]);
    if (repos && cashDeno) setRepos(repos);
    setIsCashDeno(cashDeno.data == "TRUE" ? true : false);
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <FormItem
        labelAlign="left"
        label={props.label || props.localize("Repository")}
        help={
          props.value && isCashDeno ? (
            <a style={{ float: "right" }} onClick={() => setShow(true)}>
              {props.localize("DenoInfo")}
            </a>
          ) : null
        }
      >
        <Select
          showSearch
          optionFilterProp="children"
          value={props.value || undefined}
          onChange={(val: any) => props.onChange(Number(val || 0))}
          allowClear={props.clearable}
        >
          {repos?.map((x: CashRepository) => (
            <Select.Option title={x.repoName} key={x.id} value={x.id}>
              {x.repoName}
            </Select.Option>
          ))}
        </Select>
      </FormItem>
      <Modal
        okText={props.localize("Ok")}
        width={"60%"}
        cancelText={props.localize("Cancel")}
        open={show}
        footer={null}
        onCancel={() => setShow(false)}
      >
        <DenoBalanceModal
          localize={props.localize}
          repoId={props.value}
        ></DenoBalanceModal>
      </Modal>
    </>
  );
};
