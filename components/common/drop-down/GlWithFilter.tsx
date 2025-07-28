import React from "react";
import { get, post } from "@/shared/services/ajaxService.ts";
import { AutoComplete, Collapse, Input, Modal, Row, Tree } from "antd";
import _ from "lodash";
import { LocalizeFn } from "@/shared/context/LocaleContext.tsx";
import Search from "antd/lib/input/Search";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { ChartOfAccountView } from "@/shared/model/account/ChartOfAccountView";
import Loader from "../../Loader/Loader";
import { getGlAccountsByType } from "@/shared/services/dropdownservice/dropdownService";
import { gutterSize } from "@/shared/constant/gutter";
import { SearchResult } from "@/shared/model/search/Search";
import { ChartOfAccount } from "@/shared/model/account/ChartOfAccount";

interface AccountProps {
  id?: string;
  onChange: (val: number, result?: SearchResult) => void;
  onReset?: () => void;
  root?: "Assets" | "Expenses" | "Incomes" | "Liabilities";
  label?: string;
  placeHolder?: string;
  value?: number;
  loading?: boolean;
  limit?: number;
  groupOnly?: boolean;
  notSys?: boolean;
  localize: LocalizeFn;
  required?: boolean;
}

interface AutoCompleteResult {
  // TotalCount: number;
  // Results: SearchResult[];
  totalCount: number;
  results: SearchResult[];
}

interface State {
  searchResult: SearchResult[];
  queryText?: string;
  loading?: boolean;
  showModal: boolean;
  data: ChartOfAccount[];
  assets: ChartOfAccount[];
  laib: ChartOfAccount[];
  income: ChartOfAccount[];
  expenses: ChartOfAccount[];
  expandedKeys: any;
  searchValue: string;
  autoExpandParent: boolean;
}

class GlWithFilter extends React.Component<AccountProps, State> {
  state: State = {
    searchResult: [],
    showModal: false,
    expandedKeys: [],
    data: [],
    assets: [],
    expenses: [],
    income: [],
    laib: [],
    searchValue: "",
    autoExpandParent: false,
  };

  constructor(props: AccountProps) {
    super(props);

    this.search = _.debounce(this.search, 500) as any;
  }

  handleValueChange = async () => {
    if (!this.props.value || Number(this.props?.value || 0) == 0) {
      this.setState({ searchResult: [], queryText: "" });
    }

    if (this.props.value && !this.state.searchResult.length) {
      const res = await get<ChartOfAccountView>(
        `/glaccount/glaccount/${this.props.value}`
      );
      if (res) {
        const { data } = res;
        const result: SearchResult = {
          title: data.accountName,
          description: data.parent ? `${data.parent}` : "",
          value: data.id?.toString(),
        };
        this.setState({
          searchResult: [result],
          queryText: data.accountName,
        });
      }
    }
  };

  async componentDidMount() {
    this.handleValueChange();
  }

  componentDidUpdate(prevProps: AccountProps) {
    if (prevProps.value !== this.props.value) this.handleValueChange();
  }

  search = async (val: string) => {
    const res = await post<AutoCompleteResult>(
      // `/account/chart-of-account/dd-filtered`,
      `/glaccount/dd-view`,
      {
        groupOnly:
          this.props.groupOnly == undefined ? true : this.props.groupOnly,
        searchText: val,
        limit: this.props.limit != undefined ? this.props.limit : 30,
        rootName: this.props.root || "",
      }
    );
    if (res) {
      if (this.props.notSys) {
        this.setState({
          searchResult: res.data.results.filter((x) => x.custom2 == "False"),
          loading: false,
        });
      } else this.setState({ searchResult: res.data.results, loading: false });
    }
  };

  onSearch = async (val: string) => {
    if (!val) {
      this.setState({ queryText: val });
      return;
    }
    this.setState({ loading: true, queryText: val });
    this.search(val);
  };

  onSelected = async (item: SearchResult) => {
    if (item) {
      this.setState({ queryText: item.title });
      this.props.onChange(Number(item.value || 0), { ...item });
    }
  };

  render() {
    const { Option } = AutoComplete;
    const options = this.state.searchResult.map((x) => (
      <Option
        key={x.value.toString()}
        value={x.value.toString()}
        title={x.title}
      >
        {x.title}
        <br />
        <small>{x.description}</small>
      </Option>
    ));
    const dataSource: { key: string; id: string; name: string }[] = [];
    const rootItems = this.state.data.filter((x: any) => !x.ParentId);

    const handleSelect = async (keys: any) => {
      if (
        this.state.data.filter(
          (x) => Number(x.id || 0) === Number(keys[0] || 0)
        )[0]?.isGroup
      )
        return;

      const item = this.state.data.filter(
        (x: any) => Number(x.Id || 0) === Number(keys[0] || 0)
      )[0];
      this.setState({ queryText: item.accountName });
      this.props.onChange(Number(item.id || 0));
      this.setState({ showModal: false });
    };

    const childItems = (
      parent: number,
      glType: "assets" | "liabilities" | "expenses" | "incomes"
    ) => {
      let rootItems: ChartOfAccount[] = [];

      if (glType == "assets") rootItems = this.state.assets;

      if (glType == "liabilities") rootItems = this.state.laib;

      if (glType == "incomes") rootItems = this.state.income;

      if (glType == "expenses") rootItems = this.state.expenses;
      return rootItems.filter((x: any) => x.ParentId && x.ParentId === parent);
    };

    const getParentKey = (key: string, tree: ChartOfAccount[]) => {
      let parentKey = "";
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        const children = tree.filter((x: any) => x.ParentId == node.id);
        if (children) {
          if (children.some((item: any) => item.Id.toString() === key)) {
            parentKey = node.id.toString();
          } else if (getParentKey(key, children)) {
            parentKey = getParentKey(key, children);
          }
        }
      }
      return parentKey;
    };

    const onChange = (e: any) => {
      const { value } = e.target;

      if (value == "") {
        this.setState({ expandedKeys: [] });
        return;
      }

      const dataList = this.state.data.map((x: any) => {
        return {
          key: x.Id.toString(),
          title: x.AccountName.toLowerCase(),
        };
      });

      const expandedKeys = dataList
        .map((item: any) => {
          if (item.title.indexOf(value.toLowerCase()) > -1) {
            return (
              <React.Fragment key={item.title}>
                {getParentKey(item.key, this.state.data)}
              </React.Fragment>
            );
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);

      this.setState({
        expandedKeys: getParent(expandedKeys)
          .filter((x: any) => x != undefined)
          .sort((a: any, b: any) => a - b),
        searchValue: value.toLowerCase(),
        autoExpandParent: true,
      });
    };
    const { TreeNode } = Tree;
    const getChildrens = (
      parentId: number,
      glType: "assets" | "liabilities" | "expenses" | "incomes"
    ) => {
      let rootItems: ChartOfAccount[] = [];

      if (glType == "assets") rootItems = this.state.assets;

      if (glType == "liabilities") rootItems = this.state.laib;

      if (glType == "incomes") rootItems = this.state.income;

      if (glType == "expenses") rootItems = this.state.expenses;

      const length = rootItems.filter(
        (x: any) => x.ParentId == parentId
      ).length;
      if (length > 0)
        return childItems(parentId, glType).map((x: any) => (
          <TreeNode
            style={{
              fontWeight:
                this.state.searchValue != "" &&
                (
                  x.Code.toLowerCase() +
                  " " +
                  x.AccountName.toLowerCase()
                ).includes(this.state.searchValue.toLowerCase())
                  ? 1000
                  : 500,
            }}
            title={x.Code + " " + x.AccountName.trim()}
            key={x.Id.toString()}
          >
            {getChildrens(Number(x.Id || 0), glType)}
          </TreeNode>
        ));
      else
        return childItems(parentId, glType).map((x: any) => (
          <TreeNode
            style={{
              fontWeight:
                this.state.searchValue != "" &&
                (
                  x.Code.toLowerCase() +
                  " " +
                  x.AccountName.toLowerCase()
                ).includes(this.state.searchValue.toLowerCase())
                  ? 1000
                  : 500,
            }}
            title={x.Code + " " + x.AccountName.trim()}
            key={x.Id.toString()}
          ></TreeNode>
        ));
    };

    const getParent = (keys: any) => {
      if (keys.length > 0) {
        keys.forEach((x: any) => {
          if (
            this.state.data.filter((y: any) => y.Id.toString() == x).length != 0
          ) {
            const parentId = this.state.data
              .filter((y: any) => y.Id.toString() == x)[0]
              ?.parentId?.toString();
            if (keys.filter((y: any) => y == parentId).length == 0) {
              keys.push(parentId);
              getParent(keys);
            }
          }
        });
      }
      return keys;
    };

    const getTree = (
      glType: "assets" | "liabilities" | "expenses" | "incomes"
    ) => {
      let rootItems: ChartOfAccount[] = [];

      if (glType == "assets") rootItems = this.state.assets;

      if (glType == "liabilities") rootItems = this.state.laib;

      if (glType == "incomes") rootItems = this.state.income;

      if (glType == "expenses") rootItems = this.state.expenses;

      return rootItems
        .filter((x) => x.accountName.toLowerCase() == glType)
        .sort((a, b) => Number(a.code) - Number(b.code))
        .map((x) => (
          <React.Fragment key={x.id}>
            {getChildrens(x.id, glType)}
          </React.Fragment>
        ));
    };

    const form = (
      glType: "assets" | "liabilities" | "expenses" | "incomes"
    ) => {
      return (
        <>
          <Search
            placeholder={
              this.props.placeHolder != null
                ? this.props.placeHolder
                : this.props.localize("GlAccount")
            }
            onChange={onChange}
          />
          {this.state.loading ? (
            <Loader />
          ) : (
            <Tree
              onSelect={handleSelect}
              onExpand={(expandedKeys) =>
                this.setState({ ...this.state, expandedKeys })
              }
              expandedKeys={this.state.expandedKeys}
              style={{ width: "100%", maxHeight: "80vh", overflow: "auto" }}
            >
              {getTree(glType)}
            </Tree>
          )}
        </>
      );
    };

    const showModal = async () => {
      this.setState({ showModal: true, loading: true });
      const [assets, res] = await Promise.all([
        getGlAccountsByType("Assets"),
        get<ChartOfAccount[]>("/glaccount"),
      ]);
      if (assets && res) {
        this.setState({ assets, loading: false, data: res.data });
      }
    };

    return (
      <React.Fragment>
        <AutoComplete
          id={this.props.id}
          bordered={true}
          placeholder={
            this.props.placeHolder != null
              ? this.props.placeHolder
              : this.props.localize("GlAccount")
          }
          onSearch={this.onSearch}
          popupMatchSelectWidth={true}
          dataSource={options}
          value={this.state.queryText}
          onSelect={(val: any) => {
            const item = this.state.searchResult.filter(
              (x) => Number(x.value || 0) === Number(val || 0)
            )[0];
            this.onSelected(item);
          }}
          onBlur={(val: any) => {
            if (!val) {
              this.setState({ queryText: "" });
              this.props.onReset && this.props.onReset();
            }
          }}
        >
          <Input
            style={{
              width: "100%",
              padding: "4px 11px",
              background: "inherit",
            }}
            suffix={
              <span onClick={showModal} className="certain-category-icon">
                {this.props.loading || this.state.loading ? (
                  <LoadingOutlined />
                ) : (
                  <SearchOutlined />
                )}
              </span>
            }
          />
        </AutoComplete>
        <Modal
          open={this.state.showModal}
          footer={null}
          onCancel={() => this.setState({ showModal: false })}
          width="90vh"
        >
          {this.state.loading ? (
            <Loader />
          ) : (
            <>
              <Row gutter={gutterSize}>
                <Collapse
                  accordion
                  onChange={async (e: any) => {
                    this.setState({ loading: true });
                    if (e == 2 && this.state.laib.length == 0) {
                      const laib = await getGlAccountsByType("Liabilities");
                      if (laib) {
                        this.setState({ laib });
                      }
                    }

                    if (e == 3 && this.state.income.length == 0) {
                      const income = await getGlAccountsByType("Incomes");
                      if (income) {
                        this.setState({ income });
                      }
                    }

                    if (e == 4 && this.state.expenses.length == 0) {
                      const expenses = await getGlAccountsByType("Expenses");
                      if (expenses) {
                        this.setState({ expenses });
                      }
                    }
                    this.setState({ loading: false });
                  }}
                  defaultActiveKey="1"
                  style={{ width: "100%" }}
                >
                  <Collapse.Panel
                    key="1"
                    header={this.props.localize("Assets")}
                  >
                    {form("assets")}
                  </Collapse.Panel>
                  <Collapse.Panel
                    key="2"
                    header={this.props.localize("Liabilities")}
                  >
                    {form("liabilities")}
                  </Collapse.Panel>
                  <Collapse.Panel
                    key="3"
                    header={this.props.localize("Incomes")}
                  >
                    {form("incomes")}
                  </Collapse.Panel>
                  <Collapse.Panel
                    key="4"
                    header={this.props.localize("Expenses")}
                  >
                    {form("expenses")}
                  </Collapse.Panel>
                </Collapse>
              </Row>
            </>
          )}
        </Modal>
      </React.Fragment>
    );
  }
}

export { GlWithFilter };
