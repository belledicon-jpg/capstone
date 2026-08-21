import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  AlertCircle,
} from "lucide-react";

import {
  PageTransition,
  ScrollReveal,
} from "@/components/animations";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ApplicationRecord = {
  id: string;
  date: string;
  status: "Completed" | "Pending" | "Rejected";
  type: "Health Certificate" | "Sanitary Permit";
};

type FormState = {
  classification: string;
  applicationType: string;
  industry: string;
  subIndustry: string;
  businessLine: string;
  pesoChecked: boolean;
};

const SanitationServices = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"health" | "sanitary">("health");
  const [applicationHistory, setApplicationHistory] = useState<ApplicationRecord[]>([
    { id: "1672496", date: "09/25/2025", status: "Completed", type: "Health Certificate" },
    { id: "1215230", date: "8/21/2024", status: "Completed", type: "Sanitary Permit" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [formState, setFormState] = useState<FormState>({
    classification: "Individual",
    applicationType: "",
    industry: "",
    subIndustry: "",
    businessLine: "",
    pesoChecked: false,
  });
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 5;

  const applicantDetails = {
    fullName: "DELFIN, DEVINE YSABELLE REGIDOR",
    birthDate: "07/11/2005",
    gender: "Female",
    email: "delfindevineysabelle@gmail.com",
    contactNumber: "0981 682 3537",
  };

  const handleApply = (type: "health" | "sanitary") => {
    // Submit form
    const newApplication: ApplicationRecord = {
      id: Math.floor(Math.random() * 9000000 + 1000000).toString(),
      date: new Date().toLocaleDateString(),
      status: "Pending",
      type: type === "health" ? "Health Certificate" : "Sanitary Permit",
    };
    setApplicationHistory([newApplication, ...applicationHistory]);
    alert(`Application submitted for ${type === "health" ? "Health Certificate" : "Sanitary Permit"}`);
  };

  const handleViewDetails = (appId: string) => {
    navigate(`/sanitation-services/application/${appId}`);
  };

  const handleDownload = (appId: string) => {
    const app = applicationHistory.find(a => a.id === appId);
    if (app) {
      const csv = `Application ID,Date,Status,Type\n${app.id},${app.date},${app.status},${app.type}`;
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `application-${app.id}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const paginatedHistory = applicationHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(applicationHistory.length / itemsPerPage);

  return (
    <PageTransition>
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <ScrollReveal>
          {/* Applicant Details Section */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-slate-900">Applicant Details</h2>
              <button
                onClick={() => navigate("/sanitation-services/edit-profile")}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Edit profile
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-slate-500">Full Name</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{applicantDetails.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Birth Date</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{applicantDetails.birthDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Gender</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{applicantDetails.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">E-Mail</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{applicantDetails.email}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-slate-500">Contact Number</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{applicantDetails.contactNumber}</p>
              </div>
            </div>
          </section>

          {/* Application History Section */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">
              {activeTab === "health" ? "Health Certificate" : "Sanitary Permit"} Application History
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Tap or Click an entry below to revisit the application
            </p>

            {applicationHistory.length === 0 ? (
              <p className="py-8 text-center text-slate-500">No existing history</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-slate-700">Application ID</th>
                        <th className="px-4 py-3 font-semibold text-slate-700">Application Date</th>
                        <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                        <th className="px-4 py-3 font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedHistory.map((record) => (
                        <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleViewDetails(record.id)}
                              className="font-semibold text-blue-600 hover:text-blue-700 underline"
                            >
                              {record.id}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleViewDetails(record.id)}
                              className="text-blue-600 hover:text-blue-700 underline"
                            >
                              {record.date}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                                record.status === "Completed" && "bg-emerald-100 text-emerald-800",
                                record.status === "Pending" && "bg-amber-100 text-amber-800",
                                record.status === "Rejected" && "bg-red-100 text-red-800"
                              )}
                            >
                              {record.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDownload(record.id)}
                              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Rows per page:</label>
                    <select
                      value={itemsPerPage}
                      onChange={() => setCurrentPage(1)}
                      className="ml-2 rounded border border-slate-300 px-2 py-1 text-sm"
                    >
                      <option>5</option>
                      <option>10</option>
                      <option>20</option>
                    </select>
                  </div>
                  <span className="text-sm text-slate-600">
                    {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Tab Navigation */}
          <div className="mb-8 flex gap-4 border-b border-slate-200">
            <button
              onClick={() => setActiveTab("health")}
              className={cn(
                "px-4 py-2 font-medium transition-colors",
                activeTab === "health"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Health Certificate Application
            </button>
            <button
              onClick={() => setActiveTab("sanitary")}
              className={cn(
                "px-4 py-2 font-medium transition-colors",
                activeTab === "sanitary"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Sanitary Permit Application
            </button>
          </div>

          {/* Application Forms */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-slate-900 mb-2">
              {activeTab === "health" ? "Health Certificate Application" : "Sanitary Permit Application"}
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              {activeTab === "health"
                ? "Apply for Health certificate, online HIV seminar, get digital copy of your health card"
                : "Apply for Sanitary Permit, upload requirements online, get digital copy of your Provisional SP (for new business)"}
            </p>

            <div className="space-y-4">
              {activeTab === "health" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Classification *</label>
                    <select
                      value={formState.classification}
                      onChange={(e) => setFormState({ ...formState, classification: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700"
                    >
                      <option>Individual</option>
                      <option>Business</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Application Type *</label>
                <select
                  value={formState.applicationType}
                  onChange={(e) => setFormState({ ...formState, applicationType: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700"
                >
                  <option value="">Select Application Type</option>
                  <option>New Application</option>
                  <option>Renewal</option>
                  <option>Amendment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry *</label>
                <select
                  value={formState.industry}
                  onChange={(e) => setFormState({ ...formState, industry: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700"
                >
                  <option value="">Select Industry</option>
                  <option>Food and Beverage</option>
                  <option>Healthcare</option>
                  <option>Waste Management</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sub-Industry *</label>
                <select
                  value={formState.subIndustry}
                  onChange={(e) => setFormState({ ...formState, subIndustry: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700"
                >
                  <option value="">Select Sub-Industry</option>
                  <option>Restaurant</option>
                  <option>Clinic</option>
                  <option>Landfill</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Line *</label>
                <select
                  value={formState.businessLine}
                  onChange={(e) => setFormState({ ...formState, businessLine: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700"
                >
                  <option value="">Select Business Line</option>
                  <option>Dine-in Service</option>
                  <option>Take-out Service</option>
                  <option>Delivery Service</option>
                </select>
              </div>

              {activeTab === "sanitary" && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="peso"
                    checked={formState.pesoChecked}
                    onChange={(e) => setFormState({ ...formState, pesoChecked: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <label htmlFor="peso" className="text-sm text-slate-700">
                    Public Employment Service Office (PESO) beneficiary
                  </label>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => handleApply(activeTab)}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
              >
                {activeTab === "health" ? "APPLY FOR HEALTH CERTIFICATE" : "APPLY FOR SANITARY PERMIT"}
              </Button>
              <button
                onClick={() => navigate("/sanitation-services/faqs")}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
              >
                <HelpCircle className="inline h-5 w-5 mr-2" />
                FAQs
              </button>
            </div>
          </section>
        </ScrollReveal>
      </main>
    </PageTransition>
  );
};

export default SanitationServices;
