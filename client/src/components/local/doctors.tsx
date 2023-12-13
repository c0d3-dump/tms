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
import { Trash } from "lucide-react";
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

export interface DoctorState {
  doctorId: number;
  name: string;
  speciality: string;
}

export default function Doctors() {
  const [doctorData, setDoctorData] = useState<DoctorState[]>();

  const fetchDoctors = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Doctors`).then((res) => {
      setDoctorData(res.data);
    });
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const onDeleteDoctor = useCallback(
    (tableId: number) => {
      axios.delete(`${env.SERVER_URL}/api/Doctors/${tableId}`).then(() => {
        fetchDoctors();
      });
    },
    [fetchDoctors]
  );

  return (
    <>
      <Header></Header>

      <div className="flex justify-end mb-6">
        <AddDoctorComponent fetchDoctors={fetchDoctors}></AddDoctorComponent>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Doctor Name</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {doctorData?.map((doctor) => (
              <TableRow key={doctor.doctorId}>
                <TableCell>{doctor.doctorId}</TableCell>
                <TableCell>{doctor.name}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteDoctor(doctor.doctorId)}
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

interface AddDoctorComponentProps {
  fetchDoctors: () => void;
}

export function AddDoctorComponent(props: AddDoctorComponentProps) {
  const formSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(1).max(25),
    speciality: z
      .string({ required_error: "Speciality is required" })
      .min(1)
      .max(25),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onAddDoctor = useCallback(async () => {
    const doctorData = {
      name: form.getValues().name,
      speciality: form.getValues().speciality,
    };
    await axios.post(`${env.SERVER_URL}/api/Doctors`, doctorData);
    form.reset();
    form.setValue("name", "");
    form.setValue("speciality", "");
    props.fetchDoctors();
  }, [form, props]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Doctor</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Doctor</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Doctor Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="speciality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor Speciality</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Doctor Speciality" {...field} />
                </FormControl>
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
              onClick={onAddDoctor}
            >
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
