import { get } from "../ajaxService";
import { JSX } from "react";

export interface Menu {
  id: number;
  menuCode: string;
  menuName: string;
  url: string;
  config: string;
  parentId?: number;
  menuType: string;
  formUrl: string;
}

export interface MenuPermissionView {
  permissionId: number;
  branchId: number;
  userId: number;
  userName: string;
  menuId: number;
  menuCode: string;
  menuName: string;
  menuType: string;
  url: string;
  config: string;
  formUrl: string;
  parentId?: number;
  tillDate?: Date;
  allowEdit: boolean;
}

export async function getPermittedMenus() {
  const res = await get<MenuPermissionView[]>(`menu/my-menu-permissions`);
  return res && res.data;
}

export async function getMenus() {
  const res = await get<Menu[]>("menu");
  if (res) {
    return res.data;
  }
  return null;
}

/**
 * Gets the current basepath of the module. for example for account module its its "account"
 */
export function getCurrentRootMenu(rootMenus: MenuPermissionView[]) {
  const location = window.location;

  return rootMenus.find((m) =>
    m?.url?.endsWith(`/${location.pathname.split("/")[1]}`)
  );
}
export const getMenuName = (menu: MenuPermissionView) => {
  return menu.menuName.split(" ").pop()?.toLowerCase();
};

export const reports: {
  [key: string]: (keyof { [key: string]: JSX.Element })[];
} = {
  member: [
    "230",
    "231",
    "232",
    "233",
    "234",
    "235",
    "236",
    "237",
    "238",
    "239",
    "240",
    "241",
    "243",
    "227",
  ],
  teller: ["330", "331", "332", "333", "334", "335", "336", "337"],
  deposit: [
    "430",
    "431",
    "432",
    "433",
    "434",
    "435",
    "436",
    "437",
    "438",
    "439",
    "440",
    "441",
    "442",
    "455",
    "456",
    "457",
  ],
  loan: [
    "544",
    "530",
    "531",
    "532",
    "533",
    "534",
    "535",
    "536",
    "537",
    "538",
    "539",
    "540",
    "541",
    "542",
    "543",
    "560",
    "561",
    "562",
    "946",
    "947",
  ],
  share: ["930", "931", "932", "933", "934", "935"],
  collection: ["460", "461", "462", "463", "464", "465", "466", "467"],
  account: [
    "630",
    "631",
    "632",
    "633",
    "634",
    "635",
    "636",
    "637",
    "638",
    "639",
    "640",
    "641",
    "642",
    "677",
    "678",
  ],
  interest: [
    "529",
    "480",
    "481",
    "482",
    "483",
    "484",
    "485",
    "486",
    "487",
    "488",
    "489",
    "490",
    "491",
  ],
  regulator: ["150", "151", "152"],
  mis: [
    "130",
    "131",
    "132",
    "133",
    "134",
    "135",
    "136",
    "137",
    "138",
    "139",
    "140",
    "141",
    "142",
  ],
  other: [
    "242",
    "940",
    "941",
    "942",
    "943",
    "944",
    "945",
    "948",
    "950",
    "951",
    "952",
    "955",
    "957",
    "958",
    "959",
    "960",
    "961",
    "962",
    "964",
    "966",
    "715",
    "973",
  ],
  fam: [
    "949",
    "953",
    "954",
    "963",
    "965",
    "967",
    "968",
    "969",
    "970",
    "971",
    "972",
  ],
};
