import { AwilixContainer } from "awilix";

export interface IFixture {
  load(container : AwilixContainer) : Promise<void> 
}

// AwilixContainer: Đây là một đối tượng chính trong Awilix, đại diện cho container chứa tất cả các đối tượng được đăng ký. Container này cung cấp phương thức resolve() để lấy ra các đối tượng đã đăng ký từ container.