import React, { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { format } from "date-fns";
import { appointmentsAPI } from "../../services/api";
import { Appointment } from "../../types";
import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Input } from "../ui/Input";

interface AppointmentHistoryProps {
  patientId: string;
  doctorId: string;
}

export const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({
  patientId,
  doctorId,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScheduleAppointment, setShowScheduleAppointment] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await appointmentsAPI.getPatientAppointments(patientId);
        setAppointments(data);
      } catch (err) {
        setError("Failed to load appointments");
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId]);

  const handleSubmitAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const appointmentDateTime = new Date(
        `${appointmentData.date}T${appointmentData.time}`,
      );

      await appointmentsAPI.createAppointment({
        patient: patientId,
        doctor: doctorId,
        date_time: appointmentDateTime.toISOString(),
      });

      setShowScheduleAppointment(false);
      setAppointmentData({ date: "", time: "" });
      alert("Appointment scheduled successfully!");
    } catch (err) {
      console.error("Error scheduling appointment:", err);
      alert("Failed to schedule appointment");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Appointment History
        </h2>
        <Button onClick={() => setShowScheduleAppointment(true)}>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule New Appointment
        </Button>
      </div>

      {appointments.length === 0 ? (
        <Card className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Appointments Yet
          </h3>
          <p className="text-gray-500 mb-6">
            Schedule your first appointment to get started
          </p>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {appointments.map((appointment) => (
            <Card
              key={appointment.id}
              className="hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex-shrink-0">
                      <User className="h-8 w-8 text-blue-600 bg-blue-100 rounded-full p-2" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.doctor_name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(appointment.date_time), "PPP")}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {format(new Date(appointment.date_time), "p")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Doctor's Instructions:
                    </h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {appointment.instructions}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Prescription
                    </Button>
                    <Button variant="outline" size="sm">
                      View Full Details
                    </Button>
                  </div>
                </div>

                <div className="ml-4 flex-shrink-0">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {appointment.status === "completed" ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-1" />
                    )}
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showScheduleAppointment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 mt-0 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="p-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Schedule Appointment
                </h4>
                <button
                  onClick={() => setShowScheduleAppointment(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  ×
                </button>
              </div>

              <div className="border-t">
                <form onSubmit={handleSubmitAppointment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="date"
                      label="Appointment Date"
                      value={appointmentData.date}
                      onChange={(e) =>
                        setAppointmentData((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      min={format(new Date(), "yyyy-MM-dd")}
                      required
                    />
                    <Input
                      type="time"
                      label="Appointment Time"
                      value={appointmentData.time}
                      onChange={(e) =>
                        setAppointmentData((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button type="submit">
                      <Clock className="h-4 w-4 mr-2" />
                      Confirm Appointment
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowScheduleAppointment(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
