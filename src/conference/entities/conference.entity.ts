import { differenceInDays, differenceInHours } from "date-fns"
import { Entity } from "../../shared/entity"
import { User } from "../../user/entities/user.entity"

type ConferenceProps = {
  id: string,
  organizerId: string,
  title: string,
  startDate: Date,
  endDate: Date,
  seats: number,
}
// export class Conference{
export class Conference extends Entity<ConferenceProps>{
  // public initialState: ConferenceProps //đại diện cho trạng thái ban đầu không thay đổi của đối tượng hội nghị, được sử dụng như một điểm tham chiếu để so sánh hoặc đặt lại.
  // public props: ConferenceProps // lưu trữ trạng thái hiện tại của đối tượng, Ban đầu, nó được thiết lập giống như dữ liệu được truyền vào constructor. 

  // constructor( data: ConferenceProps ){
  //   this.initialState = {...data}
  //   this.props = {...data}

  //   Object.freeze(this.initialState)
  // }

  isTooClose(now: Date) : boolean {
    const diff = differenceInDays(this.props.startDate, now)
    return diff < 3
  }

  hasTooManySeats() : boolean {
    return this.props.seats > 1000
  }

  hasNotEnoughSeats() : boolean {
    return this.props.seats < 50
  }

  isTooLong() : boolean {
    const diffHours = differenceInHours(this.props.endDate, this.props.startDate)
    return diffHours > 3
  }

  isTheOrganizer(user:User) : boolean {
    return this.props.organizerId == user.props.id
  }
}

// Ko viết update va commit trong entities như thế này
  // => Tạo abstract class Entity<TTYpe>
  // => enelver aussi tt lé controllers
  // => hériter abstract class Entity<TTYpe>
  // update(data: Partial<ConferenceProps>) { // Partial(ConferenceProps : une partie de ConferenceProps
  //   this.props = {...this.props, ...data}
  // }

  // commit() { 
  //   // update valeur
  //   this.initialState = this.props
  // }
