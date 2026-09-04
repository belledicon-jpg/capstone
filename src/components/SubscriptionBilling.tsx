import React, { useState } from "react";
import {
  CreditCard,
  Download,
  Sparkles,
  Check,
  AlertCircle,
  Calendar,
  Users,
  Shield,
  ArrowUpRight,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export interface BillingHistoryItem {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  invoiceUrl?: string;
}

const initialBillingHistory: BillingHistoryItem[] = [
  { id: "INV-2024-009", date: "Sep 12, 2024", amount: "$49.00", status: "Paid" },
  { id: "INV-2024-008", date: "Aug 12, 2024", amount: "$49.00", status: "Paid" },
  { id: "INV-2024-007", date: "Jul 12, 2024", amount: "$49.00", status: "Paid" },
  { id: "INV-2024-006", date: "Jun 12, 2024", amount: "$49.00", status: "Paid" },
  { id: "INV-2024-005", date: "May 12, 2024", amount: "$49.00", status: "Paid" },
];

export const SubscriptionBilling: React.FC = () => {
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("•••");
  const [cardHolder, setCardHolder] = useState("Amina Mensah");

  // Plan state
  const [currentPlan, setCurrentPlan] = useState({
    name: "Pro Plan",
    price: "$49",
    period: "/month",
    renewsOn: "Oct 12, 2024",
    usedSeats: 4,
    totalSeats: 5,
  });

  const handleDownloadInvoice = (invoice: BillingHistoryItem) => {
    // Generate simulated text invoice file
    const content = `INVOICE ${invoice.id}
Date: ${invoice.date}
Amount: ${invoice.amount}
Status: ${invoice.status}
Account: GovServe Municipal Inspection Platform
Customer: Amina Mensah (amina@example.com)
Thank you for your business!`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Downloaded invoice ${invoice.id}`);
  };

  const handleUpdatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentDialogOpen(false);
    toast.success("Payment method updated successfully!");
  };

  const handleCancelPlan = () => {
    setCancelDialogOpen(false);
    toast.info("Subscription cancellation request received. Your plan remains active until Oct 12, 2024.");
  };

  const handleUpgradeSelect = (planName: string, price: string) => {
    setCurrentPlan((prev) => ({
      ...prev,
      name: planName,
      price: price,
      totalSeats: planName.includes("Enterprise") ? 20 : 10,
    }));
    setUpgradeDialogOpen(false);
    toast.success(`Successfully upgraded to ${planName}!`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Subscription & Billing
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          Manage your plan, payment methods, and billing history.
        </p>
      </div>

      {/* Main Grid: Active Plan & Payment Method */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Plan Card */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Active Plan
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                Current Plan
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {currentPlan.name}
                </h3>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {currentPlan.price}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {currentPlan.period}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Renews on {currentPlan.renewsOn}
              </p>
            </div>

            {/* Seats Usage */}
            <div className="space-y-2 rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-blue-600" />
                  Seat utilization
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {currentPlan.usedSeats}/{currentPlan.totalSeats} seats used
                </span>
              </div>
              <Progress
                value={(currentPlan.usedSeats / currentPlan.totalSeats) * 100}
                className="h-2 bg-slate-200 dark:bg-slate-700 [&>div]:bg-blue-600"
              />
            </div>

            {/* Plan Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                onClick={() => setUpgradeDialogOpen(true)}
                className="rounded-xl bg-blue-600 font-medium text-white shadow-sm hover:bg-blue-700"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
              <Button
                variant="outline"
                onClick={() => setCancelDialogOpen(true)}
                className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Card */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Payment Method
              </CardTitle>
              <Shield className="h-4 w-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-14 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-xs dark:border-slate-700 dark:bg-slate-900">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Visa ending in 4242
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Expires {expiry}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Default
              </Badge>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your default payment method will be automatically charged on every renewal date.
            </p>

            <div>
              <Button
                variant="outline"
                onClick={() => setPaymentDialogOpen(true)}
                className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing History Card */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Billing History
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                View and download past invoices for your account.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70 hover:bg-slate-50/70 dark:bg-slate-800/50">
                <TableHead className="pl-6">Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialBillingHistory.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <TableCell className="pl-6 font-semibold text-slate-800 dark:text-slate-200">
                    {item.id}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {item.date}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                    {item.amount}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-400">
                      <Check className="h-3 w-3" />
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadInvoice(item)}
                      className="h-8 rounded-lg text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                    >
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upgrade Plan Modal */}
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Upgrade Your Plan</DialogTitle>
            <DialogDescription>
              Choose the plan that best fits your organizational needs.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-3">
            {/* Business Plan */}
            <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100">Business Plan</span>
                  <Badge className="bg-blue-600 text-white">Recommended</Badge>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Up to 10 seats, priority support, advanced analytics & exports.
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">$99<span className="text-xs font-normal">/mo</span></div>
                <Button
                  size="sm"
                  onClick={() => handleUpgradeSelect("Business Plan", "$99")}
                  className="mt-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs"
                >
                  Select
                </Button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100">Enterprise Plan</span>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Unlimited seats, custom compliance reports, dedicated manager.
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">$249<span className="text-xs font-normal">/mo</span></div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpgradeSelect("Enterprise Plan", "$249")}
                  className="mt-2 rounded-lg text-xs"
                >
                  Select
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUpgradeDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Plan Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-5 w-5" />
              Cancel Subscription?
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to cancel your Pro Plan subscription? Your features will remain active until the end of your billing period on <strong>Oct 12, 2024</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={handleCancelPlan}>
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Payment Method Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Update Payment Method</DialogTitle>
            <DialogDescription>
              Enter your credit card details below to update your default payment method.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdatePayment} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cardHolder">Cardholder Name</Label>
              <Input
                id="cardHolder"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiration Date</Label>
                <Input
                  id="expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="123"
                  required
                />
              </div>
            </div>
            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save Card
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
