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
import { CalendarIcon, Trash } from "lucide-react";
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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { Calendar } from "../ui/calendar";

export interface PatientState {
  patientId: number;
  name: string;
  phoneNumber: string;
  birthDate: Date;
}

export default function Patients() {
  const [patientData, setPatientData] = useState<PatientState[]>();

  const fetchPatients = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Patients`).then((res) => {
      setPatientData(res.data);
    });
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const onDeletePatient = useCallback(
    (tableId: number) => {
      axios.delete(`${env.SERVER_URL}/api/Patients/${tableId}`).then(() => {
        fetchPatients();
      });
    },
    [fetchPatients]
  );

  return (
    <>
      <Header></Header>

      <div className="flex justify-end mb-6">
        <AddPatientComponent
          fetchPatients={fetchPatients}
        ></AddPatientComponent>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {patientData?.map((patient) => (
              <TableRow key={patient.patientId}>
                <TableCell>{patient.patientId}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.phoneNumber}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeletePatient(patient.patientId)}
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

interface AddPatientComponentProps {
  fetchPatients: () => void;
}

export function AddPatientComponent(props: AddPatientComponentProps) {
  const formSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(1).max(25),
    phoneNumber: z
      .string({ required_error: "Name is required" })
      .min(5)
      .max(25),
    birthDate: z.date(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onAddPatient = useCallback(async () => {
    const patientData = {
      name: form.getValues().name,
      phoneNumber: form.getValues().phoneNumber,
      birthDate: form.getValues().birthDate,
    };

    await axios.post(`${env.SERVER_URL}/api/Patients`, patientData);
    form.reset();
    form.setValue("name", "");
    form.setValue("phoneNumber", "");
    props.fetchPatients();
  }, [form, props]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Patient</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Patient</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Patient Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Phone Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      onSelect={field.onChange}
                      selected={field.value}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
              onClick={onAddPatient}
            >
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
