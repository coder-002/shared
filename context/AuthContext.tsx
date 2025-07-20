import { useGetMeta } from "@/shared/services/user/service-user";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUserMetaStore } from "../shared/store/store";
import { useGetCurrentBranch } from "../services/branches/service-branch";
import Loader from "../components/Loader/Loader";
import { Meta } from "../model/user/UserMeta";

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

  const { data: userMeta, isSuccess: isMetaLoaded } = useGetMeta();
  const { data: branch, isSuccess: isBranchLoaded } = useGetCurrentBranch();

  const isReady = isMetaLoaded && isBranchLoaded && userMeta && branch;

  useEffect(() => {
    if (isReady) {
      const today = new Date(userMeta.today);
      const monthStart = new Date(
        (userMeta.monthStart as any)?.split?.("T")[0] || new Date()
      );
      const monthEnd = new Date(
        (userMeta.monthEnd as any)?.split?.("T")[0] || new Date()
      );
      setMeta({
        ...userMeta,
        fullName: branch.fullName,
        today,
        monthStart,
        monthEnd,
      });
      setAuthenticated(true);
    }
  }, [userMetaKey, isReady, userMeta, branch]);

  return (
    <AuthContext.Provider value={meta}>
      {authenticated ? children : <Loader />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
