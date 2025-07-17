import frontdesk from "../components/assets/frontdesk.svg";
import teller from "../components/assets/teller.svg";
import loan from "../components/assets/loan.svg";
import deposit from "../components/assets/deposit.svg";
import microfinance from "../components/assets/microfinance.svg";
import digital from "../components/assets/digital.svg";
import account from "../components/assets/account.svg";
import fixed from "../components/assets/fixed.svg";
import report from "../components/assets/report.svg";

export const getMenuIconByConfig = (type: string) => {
  switch (type) {
    case "200":
      return frontdesk;
    case "300":
      return teller;
    case "400":
      return deposit;
    case "500":
      return loan;
    case "600":
      return account;
    case "700":
      return frontdesk;
    case "800":
      return microfinance;
    case "900":
      return report;
    case "1000":
      return fixed;
    case "1100":
      return digital;

    default:
      return "";
  }
};
