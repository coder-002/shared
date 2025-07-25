import { getMeta } from "@/shared/services/user/service-user";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUserMetaStore } from "../shared/store/store";
import Loader from "../components/Loader/Loader";
import { Meta } from "../model/user/UserMeta";
import { getCurrentBranch } from "../services/branches/service-branch";

const defaultMeta: Meta = {
  allowAdjustmentEntry: false,
  allowIntAdjustment: false,
  branchId: 0,
  fullName: "N/A",
  canEdit: false,
  nickName: "",
  today: new Date(),
  todayBS: "",
  userId: 0,
  multiBranchAccess: false,
  roleId: 0,
  tenant: "",
  roleName: "",
  isHeadOffice: false,
  allowGuaranteeComplete: false,
  monthEnd: new Date(),
  monthStart: new Date(),
  inProcess: false,
  allowPreDeposit: false,
  allowPreWithdrawal: false,
  allowMinBalWithdraw: false,
  allowVoucherApprove: false,
  allowVoucherReject: false,
  userFullName: "",
  userName: "",
  contact: "",
  profilePicture: "",
  loginTime: "",
};

const AuthContext = createContext(defaultMeta);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [meta, setMeta] = useState<Meta>(defaultMeta);
  const userMetaKey = useUserMetaStore((state) => state.userMetaKey);
  const [authenticated, setAuthenticated] = useState<boolean>();

  const init = async () => {
    const [userMeta, branch] = await Promise.all([
      getMeta(),
      getCurrentBranch(),
    ]);
    if (userMeta) {
      userMeta.today = new Date(userMeta.today);
      userMeta.monthEnd = userMeta.monthEnd
        ? new Date((userMeta.monthStart as any).split("T")[0])
        : userMeta.monthStart;
      userMeta.monthStart = userMeta.monthStart
        ? new Date((userMeta.monthStart as any).split("T")[0])
        : userMeta.monthStart;

      userMeta.fullName = branch.fullName;

      setMeta(userMeta);
      setAuthenticated(true);
    }
  };

  useEffect(() => {
    init().then();
  }, [userMetaKey]);

  return (
    <AuthContext.Provider value={meta}>
      {authenticated ? children : <Loader />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
