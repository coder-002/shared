import React, { useEffect, useState, useCallback } from "react";
import { Alert, AutoComplete, Input, Modal, Tooltip } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import _ from "lodash";
import { get } from "@/shared/services/ajaxService";
import { SpecialInstructionView } from "@/shared/model/customer/SpecialInstruction";
import { SearchResult } from "@/shared/model/search/Search";
import { LocalizeFn } from "@/shared/context/LocaleContext";
import { searchCustomer } from "@/shared/services/customer/service-customer";
import { CustomerView } from "@/shared/model/customer/CustomerView";

interface Props {
  id?: string;
  value?: number;
  onChange: (custId: number, res?: SearchResult) => void;
  moreInfo: boolean;
  hideMoreInfo: () => void;
  disabled?: boolean;
  localize: LocalizeFn;
  inputId?: string;
  limitBranchId?: number;
}

const CustomerSearch: React.FC<Props> = (props) => {
  const [customerId, setCustomerId] = useState<number | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [queryText, setQueryText] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [instructions, setInstructions] = useState<SpecialInstructionView[]>(
    []
  );

  const loadCustomer = useCallback(
    async (custId?: number) => {
      const customerIdToFetch = custId ?? props.value;

      if (customerIdToFetch) {
        const [res, instructionsRes] = await Promise.all([
          get<CustomerView>(`member/get-view/${customerIdToFetch}`),
          get<SpecialInstructionView[]>(
            `/special-instruction/member/${customerIdToFetch}`
          ),
        ]);

        if (res?.data) {
          const data = res.data;

          const result: SearchResult = {
            title: data.customerName,
            description: `Profile Id: ${data.profileId}, ${data.permanentAddress}`,
            value: data.id.toString(),
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            salutationId: data.salutationId,
            dateOfBirth: data.dateOfBirth || "",
            profileId: data.profileId?.toString(),
          };

          setSearchResult([result]);
          setCustomerId(data.id);
          setQueryText(data.customerName);
          setInstructions(instructionsRes.data || []);
        }
      } else {
        setQueryText("");
      }
    },
    [props.value]
  );

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  const debouncedSearch = useCallback(
    _.debounce(async (val: string) => {
      const res = await searchCustomer(val, true, props.limitBranchId);
      if (res) {
        setSearchResult(res.results);
        setLoading(false);
      }
    }, 500),
    [props.limitBranchId]
  );

  const onSearch = (val: string) => {
    if (!val) {
      setQueryText(val);
      return;
    }

    setLoading(true);
    setQueryText(val);
    debouncedSearch(val);
  };

  const onSelect = (val: string) => {
    const item = searchResult.find((x) => Number(x.value || 0) === Number(val));
    if (item) {
      setCustomerId(Number(val));
      setQueryText(item.title);
      props.onChange(Number(val), item);
    }
  };

  const onBlur = () => {
    if (!queryText) {
      setCustomerId(undefined);
      setQueryText("");
      props.onChange(0);
    }
  };

  const options = searchResult.map((x) => ({
    value: x.value.toString(),
    label: (
      <div
        key={x.value}
        title={x.title}
        style={{ borderBottom: "1px solid #aaa", paddingBottom: "0.75rem" }}
      >
        <span style={{ fontWeight: "bolder" }}>{x.title}</span>
        <br />
        <small>{x.description}</small>
      </div>
    ),
  }));

  return (
    <React.Fragment>
      <AutoComplete
        id={props.id}
        disabled={props.disabled}
        options={options}
        onSearch={onSearch}
        popupMatchSelectWidth
        value={queryText}
        filterOption={false}
        onSelect={onSelect}
        onBlur={onBlur}
        style={{ width: "100%" }}
      >
        <Input
          id={props.inputId}
          style={{ width: "100%", padding: "4px 11px", background: "inherit" }}
          suffix={
            loading ? (
              <LoadingOutlined />
            ) : (
              <Tooltip title={props.localize("Search")}>
                <SearchOutlined
                  onClick={() => setShowSearch(true)}
                  className="certain-category-icon"
                />
              </Tooltip>
            )
          }
        />
      </AutoComplete>
      <Modal
        cancelText={props.localize("Cancel")}
        open={instructions.length > 0}
        okText={props.localize("Ok")}
        onCancel={() => setInstructions([])}
        title={props.localize("Instructions")}
        footer={null}
      >
        <div>
          {instructions.map((x) => (
            <Alert
              key={x.id}
              message={props.localize("MessageFrom_", x.creator)}
              description={x.message}
              style={{ margin: "5px 0" }}
              type={x.messageType as any}
              showIcon
            />
          ))}
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default CustomerSearch;
