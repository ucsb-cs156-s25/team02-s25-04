import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function UCSBMenuItemReviewForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });

  const navigate = useNavigate();

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Row>
        {initialContents && (
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">Id</Form.Label>
              <Form.Control
                data-testid="UCSBMenuItemReviewForm-id"
                id="id"
                type="text"
                {...register("id")}
                value={initialContents.id}
                disabled
              />
            </Form.Group>
          </Col>
        )}
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="reviewerEmail">Reviewer Email</Form.Label>
            <Form.Control
              data-testid="UCSBMenuItemReviewForm-reviewerEmail"
              id="reviewerEmail"
              type="email"
              isInvalid={Boolean(errors.reviewerEmail)}
              {...register("reviewerEmail", { required: "Reviewer Email is required." })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.reviewerEmail?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="stars">Stars (1-5)</Form.Label>
            <Form.Control
              data-testid="UCSBMenuItemReviewForm-stars"
              id="stars"
              type="number"
              isInvalid={Boolean(errors.stars)}
              {...register("stars", {
                required: "Stars are required.",
                min: { value: 1, message: "Minimum is 1" },
                max: { value: 5, message: "Maximum is 5" },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.stars?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="dateReviewed">Date Reviewed</Form.Label>
            <Form.Control
              data-testid="UCSBMenuItemReviewForm-dateReviewed"
              id="dateReviewed"
              type="datetime-local"
              isInvalid={Boolean(errors.dateReviewed)}
              {...register("dateReviewed", { required: "Date Reviewed is required." })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateReviewed?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="itemId">Item ID</Form.Label>
            <Form.Control
              data-testid="UCSBMenuItemReviewForm-itemId"
              id="itemId"
              type="number"
              isInvalid={Boolean(errors.itemId)}
              {...register("itemId", { required: "Item ID is required." })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.itemId?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="comments">Comments</Form.Label>
            <Form.Control
              data-testid="UCSBMenuItemReviewForm-comments"
              id="comments"
              as="textarea"
              rows={3}
              isInvalid={Boolean(errors.comments)}
              {...register("comments", { required: "Comments are required." })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.comments?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button type="submit" data-testid="UCSBMenuItemReviewForm-submit">
            {buttonLabel}
          </Button>
          <Button
            variant="Secondary"
            onClick={() => navigate(-1)}
            data-testid="UCSBMenuItemReviewForm-cancel"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default UCSBMenuItemReviewForm;