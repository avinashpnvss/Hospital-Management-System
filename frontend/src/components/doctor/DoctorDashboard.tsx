import React, { useEffect, useMemo, useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Appointment, Doctor, Patient } from "../../types";
import { NewPatients } from "./NewPatients";
import { OldPatients } from "./OldPatients";
import {
  Users,
  UserCheck,
  Calendar,
  Activity,
  Stethoscope,
  FileText,
  LucideIcon,
} from "lucide-react";
import { appointmentsAPI, doctorsAPI } from "../../services/api";

interface DoctorDashboardProps {
  doctor: Doctor;
}

interface Tab {
  id: "overview" | "new-patients" | "old-patients";
  label: "Overview" | "New Patients" | "Existing Patients";
  icon: LucideIcon;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ doctor }) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "new-patients" | "old-patients"
  >("overview");

  const tabs: Tab[] = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "new-patients", label: "New Patients", icon: Users },
    { id: "old-patients", label: "Existing Patients", icon: UserCheck },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DoctorOverview doctor={doctor} />;
      case "new-patients":
        return <NewPatients doctorId={doctor.user.id.toString()} />;
      case "old-patients":
        return <OldPatients doctorId={doctor.user.id.toString()} />;
      default:
        return <DoctorOverview doctor={doctor} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, Dr. {doctor.user.first_name} {doctor.user.last_name}
          </h1>
          <p className="text-gray-600">
            Manage your patients and appointments from your professional
            dashboard
          </p>
        </div>

        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "primary" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 justify-center"
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

const DoctorOverview: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentsAPI.getDoctorAppointments(
          doctor.user.id,
        );
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, [doctor.user.id]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await doctorsAPI.getDoctorPatients(
          doctor.user.id.toString(),
        );
        setPatients(data);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    fetchPatients();
  }, [doctor.user.id]);

  const todayAppointments = useMemo(() => {
    const today = new Date();
    return appointments.filter(
      (appointment) =>
        new Date(appointment.date_time).toDateString() === today.toDateString(),
    ).length;
  }, [appointments]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Patients</p>
            <p className="text-2xl font-bold text-gray-900">
              {patients.length}
            </p>
          </div>
          <Users className="h-8 w-8 text-blue-600" />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">New Patients</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <UserCheck className="h-8 w-8 text-green-600" />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Today's Appointments
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {todayAppointments}
            </p>
          </div>
          <Calendar className="h-8 w-8 text-purple-600" />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <FileText className="h-8 w-8 text-orange-600" />
        </div>
      </Card>

      <Card className="md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Doctor Information
          </h3>
          <Stethoscope className="h-6 w-6 text-blue-600" />
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">
              Dr. {doctor.user.first_name} {doctor.user.last_name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Specialization</p>
            <p className="font-medium">{doctor.specialization}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{doctor.user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mobile</p>
            <p className="font-medium">{doctor.user.mobile}</p>
          </div>
        </div>
      </Card>

      <Card className="md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <Activity className="h-6 w-6 text-purple-600" />
        </div>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Review Patient Reports
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Users className="h-4 w-4 mr-2" />
            View All Patients
          </Button>
        </div>
      </Card>
    </div>
  );
};
