import React, { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { useUpdateStatusMutation } from "../slices/usersApiSlice";
import Loader from "./Loader";

const UpdateDietProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    height: "",
    weight: "",
    goalWeight: "",
    age: "",
    gender: "",
    activityLevel: "",
    goal: "",
  });

  const [updateStatus] = useUpdateStatusMutation();
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);
  const [carbs, setCarbs] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/user/status", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();

        setProfileData({
          height: data.height,
          weight: data.weight,
          goalWeight: data.goalWeight,
          age: data.age,
          gender: data.gender,
          activityLevel: data.activityLevel,
          goal: data.goal,
        });

        localStorage.setItem("profileData", JSON.stringify(data));
        setIsLoading(false);
      } catch (err) {
        toast.error("Failed to fetch profile data.");
        setIsLoading(false);
      }
    };

    const storedData = localStorage.getItem("profileData");
    if (storedData) {
      setProfileData(JSON.parse(storedData));
      setIsLoading(false);
    } else {
      fetchProfileData();
    }
  }, []);

  useEffect(() => {
    const { weight, activityLevel, goal } = profileData;
    if (weight && activityLevel && goal) {
      const activityMultiplier = {
        sedentary: 1.4,
        lightlyActive: 1.6,
        active: 1.8,
        veryActive: 2.0,
      }[activityLevel];

      let calculatedCalories = weight * 22 * activityMultiplier;
      let calculatedProtein = weight * 2.2;

      if (goal === "Cutting") calculatedCalories -= 500;
      if (goal === "Bulking") calculatedCalories += 500;

      const calculatedFat = (calculatedCalories * 0.25) / 9;
      const calculatedCarbs =
          (calculatedCalories - (calculatedProtein * 4 + calculatedFat * 9)) / 4;

      setCalories(calculatedCalories);
      setProtein(calculatedProtein);
      setFat(calculatedFat);
      setCarbs(calculatedCarbs);
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const {
      height,
      weight,
      goalWeight,
      age,
      gender,
      activityLevel,
      goal,
    } = profileData;

    if (!height || !weight || !goalWeight || !age || !gender || !activityLevel || !goal) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    try {
      const response = await updateStatus(profileData).unwrap();
      toast.success("Diet Profile Updated!");
      localStorage.setItem("profileData", JSON.stringify(profileData));
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
      <>
        <Form
            onSubmit={submitHandler}
            style={{
              maxWidth: "600px",
              margin: "auto",
              background: "#f8f9fa",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
        >
          <h2 className="text-center mb-4" style={{ color: "#1dda1d" }}>
            Update Diet Profile
          </h2>

          {["height", "weight", "goalWeight", "age"].map((field) => (
              <Form.Group key={field} className="mb-3" controlId={field}>
                <Form.Label>
                  {field.charAt(0).toUpperCase() + field.slice(1)} {field === "height" ? "(CM)" : field === "weight" || field === "goalWeight" ? "(KG)" : ""}
                </Form.Label>
                <Form.Control
                    type="text"
                    placeholder={`Enter ${field}`}
                    value={profileData[field]}
                    onChange={handleChange}
                    style={{
                      padding: "10px",
                      fontSize: "16px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                    }}
                />
              </Form.Group>
          ))}

          {["gender", "activityLevel", "goal"].map((field) => (
              <Form.Group key={field} className="mb-3" controlId={field}>
                <Form.Label>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Form.Label>
                <Form.Control
                    as="select"
                    value={profileData[field]}
                    onChange={handleChange}
                    style={{
                      padding: "10px",
                      fontSize: "16px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                    }}
                >
                  <option value="">Select {field}</option>
                  {field === "gender" && (
                      <>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </>
                  )}
                  {field === "activityLevel" && (
                      <>
                        <option value="sedentary">Sedentary</option>
                        <option value="lightlyActive">Lightly Active</option>
                        <option value="active">Active</option>
                        <option value="veryActive">Very Active</option>
                      </>
                  )}
                  {field === "goal" && (
                      <>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Cutting">Cutting</option>
                        <option value="Bulking">Bulking</option>
                      </>
                  )}
                </Form.Control>
              </Form.Group>
          ))}

          {isLoading && <Loader />}

          <Button type="submit" variant="success" className="w-100 mt-3"
                  style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    fontWeight: "600",
                    borderRadius: "5px",
                    backgroundColor: "#1dda1d",
                    border: "none",
                  }}
          >
            Update Diet Profile
          </Button>
        </Form>

        <Table striped bordered hover className="mt-4" style={{ maxWidth: "600px", margin: "auto" }}>
          <thead>
          <tr>
            <th>Calories</th>
            <th>Protein (g)</th>
            <th>Fat (g)</th>
            <th>Carbs (g)</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{Math.round(calories)}</td>
            <td>{Math.round(protein)}</td>
            <td>{Math.round(fat)}</td>
            <td>{Math.round(carbs)}</td>
          </tr>
          </tbody>
        </Table>
      </>
  );
};

export default UpdateDietProfile;
