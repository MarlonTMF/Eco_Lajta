package com.ucb.ecollajta.events.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.support.JpaRepositoryFactory;

import com.ucb.ecollajta.events.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
    
}
