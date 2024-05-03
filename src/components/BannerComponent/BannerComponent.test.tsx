import { render, screen } from "@testing-library/react";
import { BannerComponent } from "./BannerComponent";

describe("BannerComponent", () => {
  const mockSelectedElement = {
    id: 1,
    distance: 10,
    angle: 45,
  };
  const defaultProps: any = {
    selectedElement: mockSelectedElement,
  };
  it("renders banner component with correct data", () => {
    const { container } = render(<BannerComponent {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
    // Check if the header contains the correct text
    expect(
      screen.getByText(`Line ${mockSelectedElement.id + 1}`).textContent
    ).toEqual(`Line ${mockSelectedElement.id + 1}`);
    expect(Number(screen.getByRole("value1").textContent)).toEqual(
      mockSelectedElement.distance
    );
    expect(Number(screen.getByRole("value2").textContent)).toEqual(
      mockSelectedElement.angle
    );
  });
});
