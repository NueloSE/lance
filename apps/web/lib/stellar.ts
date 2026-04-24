import { Horizon, Networks } from "@stellar/stellar-sdk";

export const APP_STELLAR_NETWORK =
  (process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet").toUpperCase() ===
  "PUBLIC"
    ? Networks.PUBLIC
    : Networks.TESTNET;

const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL ||
  "https://horizon-testnet.stellar.org";

export const horizonServer = new Horizon.Server(HORIZON_URL);

export function isValidStellarAddress(address: string): boolean {
  return /^[G][A-Z2-7]{55}$/.test(address);
}

export function getWalletNetwork(): string {
  return APP_STELLAR_NETWORK === Networks.PUBLIC
    ? "public"
    : "testnet";
}

export function disconnectWallet(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("wallet_address");
    localStorage.removeItem("wallet_type");
    window.dispatchEvent(new Event("storage"));
  }
}

/* ---------- TYPES ---------- */

type WalletModalOptions = {
  onWalletSelected: () => Promise<void> | void;
};

type WalletAddressResult = {
  address: string;
};

type WalletKit = {
  openModal: (options: WalletModalOptions) => Promise<void>;
  closeModal: () => void;
  getAddress: () => Promise<WalletAddressResult>;
};

/* ---------- MOCK WALLET KIT ---------- */

export function getWalletsKit(): WalletKit {
  return {
    openModal: async ({ onWalletSelected }) => {
      await onWalletSelected();
    },

    closeModal: () => {},

    getAddress: async () => {
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem("wallet_address")
          : null;

      return {
        address:
          stored ||
          "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
      };
    },
  };
}

/* ---------- HELPERS ---------- */

export async function getConnectedWalletAddress(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return localStorage.getItem("wallet_address");
  }

  return null;
}

export async function connectWallet(): Promise<string> {
  const address =
    "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";

  if (typeof window !== "undefined") {
    localStorage.setItem("wallet_address", address);
  }

  return address;
}

export async function signTransaction(xdr: string): Promise<string> {
  return xdr;
}

export async function signMessage(_message: string): Promise<string> {
  return "mock-signature";
}

export async function getXlmBalance(_address: string): Promise<number> {
  return 0;
}