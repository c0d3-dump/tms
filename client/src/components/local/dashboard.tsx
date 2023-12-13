import { useForm } from "react-hook-form";
import Header from "./header";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { env } from "../../config";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Check, Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PatientState } from "./patients";
import { DoctorState } from "./doctors";
import { DiseaseState } from "./disease";

export interface DashboardState {
  appointmentId: number;
  appointmentedDate: Date;
  isCompleted: boolean;
  patient: {
    name: string;
  };
  doctor: {
    name: string;
  };
  disease: {
    name: string;
  };
}

export default function Dashboards() {
  const [dashboardData, setDashboardData] = useState<DashboardState[]>();

  const fetchDashboards = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Appointments`).then((res) => {
      setDashboardData(res.data);
    });
  }, []);

  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  const onDeleteDashboard = useCallback(
    (tableId: number) => {
      axios.delete(`${env.SERVER_URL}/api/Appointments/${tableId}`).then(() => {
        fetchDashboards();
      });
    },
    [fetchDashboards]
  );

  const onUpdateDashboard = useCallback(
    (tableId: number) => {
      axios.put(`${env.SERVER_URL}/api/Appointments/${tableId}`).then(() => {
        fetchDashboards();
      });
    },
    [fetchDashboards]
  );

  return (
    <>
      <Header></Header>

      <div className="flex justify-end mb-6">
        <AddDashboardComponent
          fetchDashboards={fetchDashboards}
        ></AddDashboardComponent>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Doctor Name</TableHead>
              <TableHead>Disease Name</TableHead>
              <TableHead className="text-right">Is Completed</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {dashboardData?.map((dashboard) => (
              <TableRow key={dashboard.appointmentId}>
                <TableCell>{dashboard.appointmentId}</TableCell>
                <TableCell>{dashboard.patient.name}</TableCell>
                <TableCell>{dashboard.doctor.name}</TableCell>
                <TableCell>{dashboard.disease.name}</TableCell>
                <TableCell className="text-right">
                  {dashboard.isCompleted ? (
                    <></>
                  ) : (
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onUpdateDashboard(dashboard.appointmentId)}
                    >
                      <Check></Check>
                    </Button>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteDashboard(dashboard.appointmentId)}
                  >
                    <Trash></Trash>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

interface AddDashboardComponentProps {
  fetchDashboards: () => void;
}

export function AddDashboardComponent(props: AddDashboardComponentProps) {
  const formSchema = z.object({
    patientId: z
      .string({ required_error: "patient is required" })
      .min(1)
      .max(25),
    doctorId: z.string({ required_error: "doctor is required" }).min(1).max(25),
    diseaseId: z
      .string({ required_error: "disease is required" })
      .min(1)
      .max(25),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [patientData, setPatientData] = useState<PatientState[]>();
  const [doctorData, setDoctorData] = useState<DoctorState[]>();
  const [diseaseData, setDiseaseData] = useState<DiseaseState[]>();

  useEffect(() => {
    axios.get(`${env.SERVER_URL}/api/Patients`).then((res) => {
      setPatientData(res.data);
    });

    axios.get(`${env.SERVER_URL}/api/Doctors`).then((res) => {
      setDoctorData(res.data);
    });

    axios.get(`${env.SERVER_URL}/api/Diseases`).then((res) => {
      setDiseaseData(res.data);
    });
  }, []);

  const onAddDashboard = useCallback(async () => {
    const dashboardData = {
      patientId: form.getValues().patientId,
      diseaseId: form.getValues().diseaseId,
      doctorId: form.getValues().doctorId,
      appointmentedDate: new Date(),
      isCompleted: false,
    };

    await axios.post(`${env.SERVER_URL}/api/Appointments`, dashboardData);
    form.reset();
    form.setValue("diseaseId", "");
    form.setValue("doctorId", "");
    form.setValue("patientId", "");
    props.fetchDashboards();
  }, [form, props]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Appointment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Appointment</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient</FormLabel>

                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Patient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patientData?.map((patient) => (
                      <SelectItem
                        key={patient.patientId}
                        value={patient.patientId.toString()}
                      >
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor</FormLabel>

                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Doctor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctorData?.map((doctor) => (
                      <SelectItem
                        key={doctor.doctorId}
                        value={doctor.doctorId.toString()}
                      >
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="diseaseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disease</FormLabel>

                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Disease" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {diseaseData?.map((disease) => (
                      <SelectItem
                        key={disease.diseaseId}
                        value={disease.diseaseId.toString()}
                      >
                        {disease.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={!form.formState.isValid}
              type="submit"
              onClick={onAddDashboard}
            >
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
