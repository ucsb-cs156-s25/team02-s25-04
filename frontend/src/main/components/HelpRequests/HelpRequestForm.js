import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function HelpRequestForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const defaultValues = initialContents
    ? {
        ...initialContents,
        requestTime: initialContents?.requestTime.replace("Z", ""),
      }
    : {
        requesterEmail: "",
        teamId: "",
        tableOrBreakoutRoom: "",
        requestTime: "",
        explanation: "",
        solved: false,
      };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });
  // Stryker restore all

  const navigate = useNavigate();

  const testIdPrefix = "HelpRequestForm";

  // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
  // Note that even this complex regex may still need some tweaks

  // Stryker disable Regex
  const isodate_regex =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
  // Stryker restore Regex

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Row>
        {initialContents && (
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">Id</Form.Label>
              <Form.Control
                data-testid={testIdPrefix + "-id"}
                id="id"
                type="text"
                {...register("id")}
                value={initialContents.id}
                disabled
              />
            </Form.Group>
          </Col>
        )}

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="requesterEmail">Email</Form.Label>
            <Form.Control
              data-testid={testIdPrefix + "-requesterEmail"}
              id="requesterEmail"
              type="text"
              isInvalid={Boolean(errors.requesterEmail)}
              {...register("requesterEmail", {
                required: "Email is required.",
                maxLength: {
                  value: 255,
                  message: "Email - Max length 255 characters",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.requesterEmail?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="teamId">Team ID</Form.Label>
            <Form.Control
              id="teamId"
              type="text"
              isInvalid={Boolean(errors.teamId)}
              {...register("teamId", {
                required: "Team ID is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.teamId?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="tableOrBreakoutRoom">
              Table/Breakout Room #
            </Form.Label>
            <Form.Control
              id="tableOrBreakoutRoom"
              type="text"
              isInvalid={Boolean(errors.tableOrBreakoutRoom)}
              {...register("tableOrBreakoutRoom", {
                required: "Table or Breakout Room number is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.tableOrBreakoutRoom?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="requestTime">Request Time </Form.Label>
            <Form.Control
              id="requestTime"
              type="datetime-local"
              isInvalid={Boolean(errors.requestTime)}
              {...register("requestTime", {
                required: true,
                pattern: isodate_regex,
                setValueAs: (value) => {
                  // Append 'Z' if it doesn't already have one
                  if (value && !value.endsWith("Z")) {
                    return value + "Z";
                  }
                  return value;
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.requestTime && "Request Time is required. "}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="explanation">Explanation</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-explanation"}
          id="explanation"
          type="text"
          isInvalid={Boolean(errors.explanation)}
          {...register("explanation", {
            required: "Explanation is required.",
            maxLength: {
              value: 255,
              message: "Explanation - Max length 255 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.explanation?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="solved">Has it been solved?</Form.Label>
        <Form.Check
          id="solved"
          type="checkbox"
          isInvalid={Boolean(errors.solved)}
          {...register("solved", {})}
        />
        <Form.Control.Feedback type="invalid">
          {errors.solved?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit">{buttonLabel}</Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid={testIdPrefix + "-cancel"}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default HelpRequestForm;
