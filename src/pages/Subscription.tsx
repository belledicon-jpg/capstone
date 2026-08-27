import React from "react";
import { PageTransition } from "@/components/animations";
import { SubscriptionBilling } from "@/components/SubscriptionBilling";

const SubscriptionPage = () => {
  return (
    <PageTransition>
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <SubscriptionBilling />
      </main>
    </PageTransition>
  );
};

export default SubscriptionPage;
